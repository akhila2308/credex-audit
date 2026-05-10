export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface ToolEntry {
  id: string
  toolName: ToolName
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditInput {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  toolId: string
  toolName: ToolName
  plan: string
  currentSpend: number
  recommendedAction: 'downgrade' | 'switch' | 'keep' | 'optimize'
  recommendedTool?: string
  recommendedPlan?: string
  projectedSpend: number
  monthlySavings: number
  annualSavings: number
  reason: string
}

export interface AuditResult {
  id: string
  input: AuditInput
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary?: string
  createdAt: string
}

export interface Lead {
  email: string
  companyName?: string
  role?: string
  teamSize?: number
  auditId: string
}

export type PlanInfo = {
  name: string
  pricePerSeat: number
  minSeats?: number
  maxSeats?: number
  notes?: string
}

export type ToolPricing = {
  displayName: string
  plans: Record<string, PlanInfo>
}