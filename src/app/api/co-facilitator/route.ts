import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const STAGE_PROMPTS: Record<string, string> = {
  empathize: `You are an expert Design Thinking facilitator running the EMPATHIZE stage.
Your role is to help the user deeply understand the people they are designing for.
Ask probing questions about:
- Who are the users/stakeholders affected?
- What are their pain points, needs, and desires?
- What emotions do they experience in the current situation?
- What context and environment do they operate in?

Provide structured insights, suggest user research methods, and help map out empathy findings.
Be encouraging, insightful, and practical. Use bullet points and clear structure.`,

  define: `You are an expert Design Thinking facilitator running the DEFINE stage.
Based on empathy insights provided, help the user:
- Synthesize findings into clear problem statements
- Create "How Might We..." questions
- Identify the core need vs surface-level symptoms
- Define success criteria

Frame a clear, actionable problem statement. Be specific and human-centered.`,

  ideate: `You are an expert Design Thinking facilitator running the IDEATE stage.
Help the user generate creative solutions:
- Suggest diverse brainstorming techniques (SCAMPER, reverse brainstorming, etc.)
- Generate 5-10 creative ideas based on the problem statement
- Push beyond obvious solutions
- Encourage wild ideas before filtering
- Help categorize and prioritize ideas by feasibility and impact

Be creative, energetic, and build on the user's input.`,

  prototype: `You are an expert Design Thinking facilitator running the PROTOTYPE stage.
Help the user plan tangible prototypes:
- Suggest appropriate prototype fidelity (paper, digital, physical)
- Define what to test with each prototype
- Create a prototype plan with steps and materials
- Identify key assumptions to validate
- Keep it fast and cheap — prototype to learn, not to build

Be practical and action-oriented.`,

  test: `You are an expert Design Thinking facilitator running the TEST stage.
Help the user plan and interpret testing:
- Design test scenarios and interview scripts
- Define metrics for success
- Suggest who to test with and how many
- Help analyze test results and extract insights
- Recommend iterations based on feedback
- Summarize key learnings and next steps

Be analytical yet empathetic. Focus on learning, not validation.`,
}

export async function POST(req: NextRequest) {
  try {
    const { stage, context, previousStages } = await req.json()

    if (!stage || !context) {
      return new Response(JSON.stringify({ error: 'Stage and context are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = STAGE_PROMPTS[stage]
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: 'Invalid stage' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build conversation with previous stage context
    let fullContext = `Project/Challenge Context: ${context}\n\n`
    if (previousStages && Object.keys(previousStages).length > 0) {
      fullContext += 'Previous Stage Outputs:\n'
      for (const [stageName, output] of Object.entries(previousStages)) {
        fullContext += `\n--- ${stageName.toUpperCase()} ---\n${output}\n`
      }
    }

    // Stream the response
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: fullContext,
        },
      ],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
