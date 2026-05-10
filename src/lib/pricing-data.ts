import { ToolPricing } from '@/types'

// All prices verified May 2026
// Sources documented in PRICING_DATA.md

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    displayName: 'Cursor',
    plans: {
      hobby: {
        name: 'Hobby',
        pricePerSeat: 0,
        notes: 'Free tier, limited completions'
      },
      pro: {
        name: 'Pro',
        pricePerSeat: 20,
        notes: 'Unlimited completions, GPT-4, Claude'
      },
      business: {
        name: 'Business',
        pricePerSeat: 40,
        notes: 'SSO, usage dashboard, privacy mode'
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 60,
        notes: 'Custom contracts, dedicated support'
      }
    }
  },
  'github-copilot': {
    displayName: 'GitHub Copilot',
    plans: {
      individual: {
        name: 'Individual',
        pricePerSeat: 10,
        notes: 'Basic completions, chat'
      },
      business: {
        name: 'Business',
        pricePerSeat: 19,
        notes: 'Policy management, audit logs'
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 39,
        notes: 'Fine-tuning, security features'
      }
    }
  },
  claude: {
    displayName: 'Claude',
    plans: {
      free: {
        name: 'Free',
        pricePerSeat: 0,
        notes: 'Limited messages per day'
      },
      pro: {
        name: 'Pro',
        pricePerSeat: 20,
        notes: '5x more usage, Projects, priority access'
      },
      max: {
        name: 'Max',
        pricePerSeat: 100,
        notes: '5x more usage than Pro'
      },
      team: {
        name: 'Team',
        pricePerSeat: 30,
        minSeats: 5,
        notes: 'Collaboration features, admin console'
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 60,
        notes: 'SSO, audit logs, custom limits'
      },
      'api-direct': {
        name: 'API Direct',
        pricePerSeat: 0,
        notes: 'Pay per token, no seat cost'
      }
    }
  },
  chatgpt: {
    displayName: 'ChatGPT',
    plans: {
      free: {
        name: 'Free',
        pricePerSeat: 0,
        notes: 'GPT-4o mini, limited GPT-4o'
      },
      plus: {
        name: 'Plus',
        pricePerSeat: 20,
        notes: 'GPT-4o, image gen, advanced features'
      },
      team: {
        name: 'Team',
        pricePerSeat: 30,
        minSeats: 2,
        notes: 'Shared workspace, admin controls'
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 60,
        notes: 'SSO, unlimited GPT-4, security'
      },
      'api-direct': {
        name: 'API Direct',
        pricePerSeat: 0,
        notes: 'Pay per token, no seat cost'
      }
    }
  },
  'anthropic-api': {
    displayName: 'Anthropic API',
    plans: {
      'pay-as-you-go': {
        name: 'Pay As You Go',
        pricePerSeat: 0,
        notes: 'Token-based pricing, no seat cost'
      }
    }
  },
  'openai-api': {
    displayName: 'OpenAI API',
    plans: {
      'pay-as-you-go': {
        name: 'Pay As You Go',
        pricePerSeat: 0,
        notes: 'Token-based pricing, no seat cost'
      }
    }
  },
  gemini: {
    displayName: 'Gemini',
    plans: {
      free: {
        name: 'Free',
        pricePerSeat: 0,
        notes: 'Gemini 1.5 Flash, limited'
      },
      pro: {
        name: 'Gemini Advanced',
        pricePerSeat: 19.99,
        notes: 'Gemini Ultra 1.0, 1TB Drive'
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 30,
        notes: 'Workspace integration, admin controls'
      },
      api: {
        name: 'API',
        pricePerSeat: 0,
        notes: 'Pay per token'
      }
    }
  },
  windsurf: {
    displayName: 'Windsurf',
    plans: {
      free: {
        name: 'Free',
        pricePerSeat: 0,
        notes: 'Limited credits per month'
      },
      pro: {
        name: 'Pro',
        pricePerSeat: 15,
        notes: 'Unlimited completions, premium models'
      },
      teams: {
        name: 'Teams',
        pricePerSeat: 30,
        notes: 'Admin controls, usage analytics'
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 60,
        notes: 'Custom deployment, SSO'
      }
    }
  }
}

export const getToolPrice = (
  toolName: string,
  planName: string,
  seats: number
): number => {
  const tool = PRICING_DATA[toolName]
  if (!tool) return 0
  const plan = tool.plans[planName]
  if (!plan) return 0
  return plan.pricePerSeat * seats
}

export const getToolDisplayName = (toolName: string): string => {
  return PRICING_DATA[toolName]?.displayName ?? toolName
}