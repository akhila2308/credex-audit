import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { supabase } from '@/lib/supabase'
import { AuditResult } from '@/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const generateFallbackSummary = (audit: AuditResult): string => {
  const { totalMonthlySavings, totalAnnualSavings, input } = audit
  if (totalMonthlySavings === 0) {
    return `Your team of ${input.teamSize} is already spending efficiently on AI tools. Your current stack is well-optimized for ${input.useCase} workflows. No immediate changes are recommended, but revisit this audit as your team grows or new tools emerge.`
  }
  return `Your team of ${input.teamSize} is currently overspending on AI tools by $${totalMonthlySavings.toFixed(0)}/month — that's $${totalAnnualSavings.toFixed(0)}/year. By adjusting your plans and switching where it makes sense for your ${input.useCase} workflows, you can capture these savings immediately without sacrificing capability.`
}

export async function POST(req: NextRequest) {
  try {
    const { audit }: { audit: AuditResult } = await req.json()

    const toolsSummary = audit.recommendations
      .map(r => `${r.toolName} (${r.plan}): $${r.currentSpend}/mo → ${r.recommendedAction}, saves $${r.monthlySavings}/mo. Reason: ${r.reason}`)
      .join('\n')

    const prompt = `You are a concise financial analyst specializing in AI tool costs for startups.

A team of ${audit.input.teamSize} people using AI primarily for ${audit.input.useCase} just completed a spend audit. Here are the findings:

${toolsSummary}

Total monthly savings identified: $${audit.totalMonthlySavings.toFixed(0)}
Total annual savings identified: $${audit.totalAnnualSavings.toFixed(0)}

Write a personalized 80-100 word summary paragraph for this team. Be specific, use the actual numbers, mention the biggest saving opportunity by name, and end with one actionable sentence. Do not use bullet points. Write in second person ("your team").`

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    })

    const summary = completion.choices[0]?.message?.content?.trim() ?? generateFallbackSummary(audit)

    await supabase
      .from('audits')
      .update({ ai_summary: summary })
      .eq('id', audit.id)

    return NextResponse.json({ summary })
  } catch (err) {
    console.error('Summary error:', err)
    const { audit }: { audit: AuditResult } = await req.json().catch(() => ({ audit: null }))
    return NextResponse.json({
      summary: audit ? generateFallbackSummary(audit) : 'Your AI spend audit is complete. Review the recommendations above to optimize your tooling costs.'
    })
  }
}