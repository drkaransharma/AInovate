import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { text, workspace_id } = await req.json()

    if (!text || !workspace_id) {
      return NextResponse.json({ error: 'Text and workspace_id are required' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `Analyze the following text for sentiment and inclusion. Return a JSON object with exactly these fields:

- "sentiment_score": a number from -1.0 (very negative) to 1.0 (very positive), with 0 being neutral
- "sentiment_label": one of "Very Negative", "Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Positive", "Very Positive"
- "inclusion_risk": one of "None", "Low", "Medium", "High" — assess whether the text contains language that could be exclusionary, biased, or non-inclusive
- "inclusion_details": brief explanation of any inclusion concerns found, or "No inclusion concerns detected"
- "recommendation": 2-3 actionable sentences on how to improve the text's tone, clarity, or inclusiveness
- "key_themes": array of 2-4 key themes or topics detected in the text
- "emotional_tone": the primary emotional tone (e.g., "Confident", "Anxious", "Hopeful", "Frustrated", "Neutral")

Text to analyze:
"""
${text}
"""

Return ONLY valid JSON, no other text.`,
        },
      ],
    })

    const aiText = message.content[0].type === 'text' ? message.content[0].text : ''
    let result
    try {
      result = JSON.parse(aiText)
    } catch {
      result = {
        sentiment_score: 0,
        sentiment_label: 'Neutral',
        inclusion_risk: 'None',
        inclusion_details: 'Analysis could not be completed.',
        recommendation: 'Please try again with different text.',
        key_themes: [],
        emotional_tone: 'Neutral',
      }
    }

    // Store in Supabase (RLS enforces workspace membership)
    await supabase.from('sentiment_analyses').insert({
      workspace_id,
      user_id: user.id,
      input_text: text,
      sentiment_score: result.sentiment_score,
      inclusion_risk: result.inclusion_risk,
      recommendation: result.recommendation,
    })

    return NextResponse.json(result)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
