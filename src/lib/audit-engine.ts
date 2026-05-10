import { AuditInput, AuditResult, ToolEntry, ToolRecommendation } from '@/types'
import { PRICING_DATA } from './pricing-data'
import { v4 as uuidv4 } from 'uuid'

// Install uuid: npm install uuid && npm install -D @types/uuid

const analyzeTool = (
  tool: ToolEntry,
  teamSize: number,
  useCase: string
): ToolRecommendation => {
  const currentSpend = tool.monthlySpend
  let recommendedAction: ToolRecommendation['recommendedAction'] = 'keep'
  let recommendedPlan = tool.plan
  let recommendedTool = tool.toolName
  let projectedSpend = currentSpend
  let reason = 'Your current plan is well-suited for your usage.'

  const pricing = PRICING_DATA[tool.toolName]

  switch (tool.toolName) {
    case 'cursor': {
      if (tool.plan === 'business' && tool.seats <= 2) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'pro'
        projectedSpend = 20 * tool.seats
        reason = `Business plan ($40/seat) is designed for teams needing SSO and admin controls. With only ${tool.seats} seat(s), Pro ($20/seat) covers all core features at half the cost.`
      } else if (tool.plan === 'enterprise' && tool.seats < 10) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'business'
        projectedSpend = 40 * tool.seats
        reason = `Enterprise pricing is justified at 10+ seats with custom contracts. At ${tool.seats} seat(s), Business plan gives you the same team features.`
      } else if (
        useCase === 'writing' ||
        useCase === 'research' ||
        useCase === 'data'
      ) {
        recommendedAction = 'switch'
        recommendedTool = 'claude'
        recommendedPlan = 'pro'
        projectedSpend = 20 * tool.seats
        reason = `Cursor is optimized for coding workflows. For ${useCase}, Claude Pro gives better results at the same price point with superior long-context reasoning.`
      } else {
        recommendedAction = 'keep'
        reason = `Cursor Pro/Business is the right choice for coding teams. Your ${tool.seats} seat(s) on ${tool.plan} is well-calibrated.`
      }
      break
    }

    case 'github-copilot': {
      if (tool.plan === 'enterprise' && tool.seats < 10) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'business'
        projectedSpend = 19 * tool.seats
        reason = `GitHub Copilot Enterprise ($39/seat) is built for large orgs needing fine-tuning on private repos. At ${tool.seats} seat(s), Business ($19/seat) covers all practical needs.`
      } else if (tool.plan === 'business' && useCase === 'coding' && tool.seats >= 3) {
        recommendedAction = 'switch'
        recommendedTool = 'cursor'
        recommendedPlan = 'pro'
        projectedSpend = 20 * tool.seats
        reason = `For coding teams of ${tool.seats}+, Cursor Pro ($20/seat) provides significantly better autocomplete quality and multi-file context than Copilot Business ($19/seat) at a comparable price.`
      } else {
        recommendedAction = 'keep'
        reason = `GitHub Copilot ${tool.plan} is appropriately priced for your team size and integrates natively with your GitHub workflow.`
      }
      break
    }

    case 'claude': {
      if (tool.plan === 'team' && tool.seats < 5) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'pro'
        projectedSpend = 20 * tool.seats
        reason = `Claude Team ($30/seat) requires a minimum of 5 seats and adds collaboration features. With ${tool.seats} seat(s), individual Pro plans ($20/seat) are cheaper and functionally equivalent.`
      } else if (tool.plan === 'max' && tool.seats > 1) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'team'
        projectedSpend = 30 * tool.seats
        reason = `Claude Max ($100/seat) is designed for power users who hit Pro limits daily. For a team of ${tool.seats}, Team plan ($30/seat) gives shared usage pools at 70% less per seat.`
      } else if (tool.plan === 'enterprise' && tool.seats < 15) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'team'
        projectedSpend = 30 * tool.seats
        reason = `Claude Enterprise is justified at 15+ seats for SSO and audit log requirements. At ${tool.seats} seats, Team plan delivers the same core capability.`
      } else {
        recommendedAction = 'keep'
        reason = `Claude ${tool.plan} is well-matched to your team size and ${useCase} use case.`
      }
      break
    }

    case 'chatgpt': {
      if (tool.plan === 'team' && tool.seats < 3) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'plus'
        projectedSpend = 20 * tool.seats
        reason = `ChatGPT Team ($30/seat) adds a shared workspace but requires overhead not worth it under 3 seats. Plus ($20/seat) per user is $${(30 - 20) * tool.seats}/mo cheaper with identical model access.`
      } else if (
        tool.plan === 'plus' &&
        useCase === 'coding' &&
        tool.seats >= 2
      ) {
        recommendedAction = 'switch'
        recommendedTool = 'cursor'
        recommendedPlan = 'pro'
        projectedSpend = 20 * tool.seats
        reason = `For coding, Cursor Pro ($20/seat) is purpose-built with IDE integration, multi-file context, and codebase awareness. ChatGPT Plus is a general tool at the same price.`
      } else if (tool.plan === 'enterprise' && tool.seats < 10) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'team'
        projectedSpend = 30 * tool.seats
        reason = `ChatGPT Enterprise ($60/seat) is priced for large orgs needing compliance and unlimited usage. Under 10 seats, Team plan covers all practical needs at half the cost.`
      } else {
        recommendedAction = 'keep'
        reason = `ChatGPT ${tool.plan} is appropriate for your team's ${useCase} use case.`
      }
      break
    }

    case 'anthropic-api':
    case 'openai-api': {
      const apiName =
        tool.toolName === 'anthropic-api' ? 'Anthropic' : 'OpenAI'
      if (currentSpend > 500) {
        recommendedAction = 'optimize'
        projectedSpend = currentSpend * 0.65
        reason = `At $${currentSpend}/mo on ${apiName} API, you're likely eligible for volume discounts or could reduce costs 30-40% through prompt caching, smaller model routing for simpler tasks, and batching non-urgent requests.`
      } else if (currentSpend > 200) {
        recommendedAction = 'optimize'
        projectedSpend = currentSpend * 0.75
        reason = `$${currentSpend}/mo on ${apiName} API can be reduced ~25% by implementing prompt caching for repeated context and routing simple queries to cheaper models (Haiku/GPT-4o-mini).`
      } else {
        recommendedAction = 'keep'
        reason = `Your ${apiName} API spend of $${currentSpend}/mo is reasonable. Monitor usage patterns as you scale.`
      }
      break
    }

    case 'gemini': {
      if (tool.plan === 'pro' && useCase === 'coding') {
        recommendedAction = 'switch'
        recommendedTool = 'cursor'
        recommendedPlan = 'pro'
        projectedSpend = 20 * tool.seats
        reason = `Gemini Advanced ($20/seat) is a general assistant. For coding, Cursor Pro ($20/seat) provides direct IDE integration and codebase-aware completions at the same price.`
      } else if (tool.plan === 'enterprise' && tool.seats < 5) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'pro'
        projectedSpend = 19.99 * tool.seats
        reason = `Gemini Enterprise ($30/seat) adds Workspace admin controls. Under 5 seats, Gemini Advanced ($20/seat) covers all model capabilities at lower cost.`
      } else {
        recommendedAction = 'keep'
        reason = `Gemini ${tool.plan} is well-suited for your ${useCase} workflow.`
      }
      break
    }

    case 'windsurf': {
      if (tool.plan === 'teams' && tool.seats < 3) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'pro'
        projectedSpend = 15 * tool.seats
        reason = `Windsurf Teams ($30/seat) adds admin controls not needed under 3 seats. Pro ($15/seat) gives full model access at half the price.`
      } else if (tool.plan === 'enterprise' && tool.seats < 10) {
        recommendedAction = 'downgrade'
        recommendedPlan = 'teams'
        projectedSpend = 30 * tool.seats
        reason = `Windsurf Enterprise is for large deployments. Under 10 seats, Teams plan covers all practical needs.`
      } else {
        recommendedAction = 'keep'
        reason = `Windsurf ${tool.plan} is appropriately priced for your team size.`
      }
      break
    }
  }

  const monthlySavings = Math.max(0, currentSpend - projectedSpend)
  const annualSavings = monthlySavings * 12

  return {
    toolId: tool.id,
    toolName: tool.toolName,
    plan: tool.plan,
    currentSpend,
    recommendedAction,
    recommendedTool: recommendedTool !== tool.toolName ? recommendedTool : undefined,
    recommendedPlan: recommendedPlan !== tool.plan ? recommendedPlan : undefined,
    projectedSpend,
    monthlySavings,
    annualSavings,
    reason
  }
}

export const runAudit = (input: AuditInput): AuditResult => {
  const recommendations = input.tools.map((tool) =>
    analyzeTool(tool, input.teamSize, input.useCase)
  )

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  )
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    id: uuidv4(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    createdAt: new Date().toISOString()
  }
}