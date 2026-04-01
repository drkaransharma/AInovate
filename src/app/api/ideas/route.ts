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

    const { title, description, department, workspace_id } = await req.json()

    if (!title || !description || !department || !workspace_id) {
      return NextResponse.json({ error: 'Title, description, department, and workspace_id are required' }, { status: 400 })
    }

    // Use Claude to analyze and tag the idea
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Analyze this business idea and return a JSON object with exactly these fields:
- "category": one of ["Product Innovation", "Process Improvement", "Cost Reduction", "Customer Experience", "Technology", "Sustainability", "Culture & People", "Revenue Growth"]
- "priority": one of ["Low", "Medium", "High", "Critical"]
- "impact_score": integer from 0-100 representing potential business impact
- "ai_summary": a concise 1-2 sentence summary of the idea and its potential value

Idea Title: ${title}
Description: ${description}
Department: ${department}

Return ONLY valid JSON, no other text.`,
        },
      ],
    })

    const aiText = message.content[0].type === 'text' ? message.content[0].text : ''
    let aiResult
    try {
      aiResult = JSON.parse(aiText)
    } catch {
      aiResult = {
        category: 'Product Innovation',
        priority: 'Medium',
        impact_score: 50,
        ai_summary: 'AI analysis pending.',
      }
    }

    // Store in Supabase (RLS enforces workspace membership)
    const { data, error } = await supabase.from('ideas').insert({
      workspace_id,
      user_id: user.id,
      title,
      description,
      department,
      category: aiResult.category,
      priority: aiResult.priority,
      impact_score: aiResult.impact_score,
      ai_summary: aiResult.ai_summary,
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const workspace_id = searchParams.get('workspace_id')
    const department = searchParams.get('department')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')

    if (!workspace_id) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 })
    }

    // RLS ensures only workspace members can read
    let query = supabase
      .from('ideas')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('created_at', { ascending: false })

    if (department) query = query.eq('department', department)
    if (priority) query = query.eq('priority', priority)
    if (category) query = query.eq('category', category)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
