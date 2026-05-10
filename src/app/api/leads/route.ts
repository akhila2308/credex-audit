import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Lead } from '@/types'

const rateLimitMap = new Map<string, number[]>()

const isRateLimited = (ip: string): boolean => {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5

  const timestamps = rateLimitMap.get(ip) ?? []
  const recent = timestamps.filter(t => now - t < windowMs)

  if (recent.length >= maxRequests) return true

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const lead: Lead = {
      email: body.email,
      companyName: body.companyName,
      role: body.role,
      teamSize: body.teamSize,
      auditId: body.auditId
    }

    if (!lead.email || !lead.auditId) {
      return NextResponse.json({ error: 'Email and audit ID required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(lead.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase.from('leads').insert({
      audit_id: lead.auditId,
      email: lead.email,
      company_name: lead.companyName,
      role: lead.role,
      team_size: lead.teamSize
    })

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}