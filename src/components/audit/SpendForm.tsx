'use client'

import { useState, useEffect } from 'react'
import { AuditInput, ToolEntry, ToolName, UseCase } from '@/types'
import { PRICING_DATA } from '@/lib/pricing-data'
import { Plus, Trash2, Zap } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'credex_audit_form'

const TOOL_OPTIONS: { value: ToolName; label: string }[] = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'github-copilot', label: 'GitHub Copilot' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'anthropic-api', label: 'Anthropic API' },
  { value: 'openai-api', label: 'OpenAI API' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'windsurf', label: 'Windsurf' }
]

const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding / Engineering' },
  { value: 'writing', label: 'Writing / Content' },
  { value: 'data', label: 'Data / Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed / General' }
]

const defaultTool = (): ToolEntry => ({
  id: uuidv4(),
  toolName: 'cursor',
  plan: 'pro',
  monthlySpend: 20,
  seats: 1
})

interface SpendFormProps {
  onSubmit: (input: AuditInput) => void
  isLoading: boolean
}

const inputStyle = {
  background: 'var(--muted)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  color: 'var(--foreground)',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'var(--font-body)'
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b8a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2.5rem'
}

const labelStyle = {
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--muted-foreground)',
  marginBottom: '0.35rem',
  display: 'block'
}

export default function SpendForm({ onSubmit, isLoading }: SpendFormProps) {
  const [tools, setTools] = useState<ToolEntry[]>([defaultTool()])
  const [teamSize, setTeamSize] = useState(5)
  const [useCase, setUseCase] = useState<UseCase>('coding')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTools(parsed.tools ?? [defaultTool()])
        setTeamSize(parsed.teamSize ?? 5)
        setUseCase(parsed.useCase ?? 'coding')
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }))
  }, [tools, teamSize, useCase])

  const addTool = () => setTools(prev => [...prev, defaultTool()])
  const removeTool = (id: string) => setTools(prev => prev.filter(t => t.id !== id))
  const updateTool = (id: string, updates: Partial<ToolEntry>) =>
    setTools(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))

  const getPlansForTool = (toolName: ToolName) => {
    const pricing = PRICING_DATA[toolName]
    if (!pricing) return []
    return Object.entries(pricing.plans).map(([key, plan]) => ({
      value: key,
      label: `${plan.name} — $${plan.pricePerSeat}/seat`
    }))
  }

  const totalMonthly = tools.reduce((sum, t) => sum + t.monthlySpend, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Team info row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Team Size</label>
          <input
            type="number"
            min={1}
            value={teamSize}
            onChange={e => setTeamSize(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Primary Use Case</label>
          <select
            value={useCase}
            onChange={e => setUseCase(e.target.value as UseCase)}
            style={selectStyle}
          >
            {USE_CASE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tools section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <label style={labelStyle}>Your AI Tools</label>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '99px',
            background: 'rgba(124,106,255,0.15)',
            color: 'var(--primary)',
            border: '1px solid rgba(124,106,255,0.3)'
          }}>
            Total: ${totalMonthly.toFixed(0)}/mo
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tools.map((tool, index) => (
            <div key={tool.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                  Tool {index + 1}
                </span>
                {tools.length > 1 && (
                  <button
                    onClick={() => removeTool(tool.id)}
                    style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--destructive)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Tool</label>
                  <select
                    value={tool.toolName}
                    onChange={e => {
                      const newTool = e.target.value as ToolName
                      const firstPlan = Object.keys(PRICING_DATA[newTool]?.plans ?? {})[0] ?? 'pro'
                      const firstPrice = PRICING_DATA[newTool]?.plans[firstPlan]?.pricePerSeat ?? 0
                      updateTool(tool.id, { toolName: newTool, plan: firstPlan, monthlySpend: firstPrice * tool.seats })
                    }}
                    style={selectStyle}
                  >
                    {TOOL_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Plan</label>
                  <select
                    value={tool.plan}
                    onChange={e => {
                      const price = PRICING_DATA[tool.toolName]?.plans[e.target.value]?.pricePerSeat ?? 0
                      updateTool(tool.id, { plan: e.target.value, monthlySpend: price * tool.seats })
                    }}
                    style={selectStyle}
                  >
                    {getPlansForTool(tool.toolName).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={e => {
                      const seats = Number(e.target.value)
                      const price = PRICING_DATA[tool.toolName]?.plans[tool.plan]?.pricePerSeat ?? 0
                      updateTool(tool.id, { seats, monthlySpend: price * seats })
                    }}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Monthly Spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={tool.monthlySpend}
                    onChange={e => updateTool(tool.id, { monthlySpend: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addTool}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            padding: '0.6rem',
            background: 'transparent',
            border: '1px dashed var(--border)',
            borderRadius: '0.75rem',
            color: 'var(--muted-foreground)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-body)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--primary)'
            e.currentTarget.style.color = 'var(--primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--muted-foreground)'
          }}
        >
          <Plus size={13} />
          Add another tool
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={() => onSubmit({ tools, teamSize, useCase })}
        disabled={isLoading || tools.length === 0}
        style={{
          width: '100%',
          padding: '0.85rem',
          background: isLoading ? 'rgba(107,127,212,0.3)' : 'linear-gradient(135deg, var(--primary), #9aaae8)',
          border: 'none',
          borderRadius: '0.75rem',
          color: 'white',
          fontSize: '0.95rem',
          fontWeight: 700,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.01em',
          boxShadow: isLoading ? 'none' : '0 4px 20px rgba(107,127,212,0.3)'
        }}
      >
        {isLoading ? (
          <>
            <span className="shimmer" style={{ width: 14, height: 14, borderRadius: '50%', display: 'inline-block' }} />
            Analyzing your spend...
          </>
        ) : (
          <>
            <Zap size={15} />
            Run Free Audit
          </>
        )}
      </button>
    </div>
  )
}