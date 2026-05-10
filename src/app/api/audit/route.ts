import { NextRequest, NextResponse } from 'next/server'
import { runAudit } from '@/lib/audit-engine'
import { supabase } from '@/lib/supabase'
import { AuditInput } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json()

    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json({ error: 'No tools provided' }, { status: 400 })
    }

    const result = runAudit(body)

    const { error } = await supabase.from('audits').insert({
      id: result.id,
      tools: result.input.tools,
      team_size: result.input.teamSize,
      use_case: result.input.useCase,
      recommendations: result.recommendations,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      created_at: result.createdAt
    })

    if (error) {
      console.error('Supabase insert error:', error)
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Audit error:', err)
    return NextResponse.json({ error: 'Failed to run audit' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'No audit ID provided' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: data.id,
    input: {
      tools: data.tools,
      teamSize: data.team_size,
      useCase: data.use_case
    },
    recommendations: data.recommendations,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    aiSummary: data.ai_summary,
    createdAt: data.created_at
  })
}