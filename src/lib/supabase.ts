import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  audits: {
    id: string
    tools: any
    team_size: number
    use_case: string
    recommendations: any
    total_monthly_savings: number
    total_annual_savings: number
    ai_summary?: string
    created_at: string
  }
  leads: {
    id: string
    audit_id: string
    email: string
    company_name?: string
    role?: string
    team_size?: number
    created_at: string
  }
}