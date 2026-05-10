'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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

  const removeTool = (id: string) =>
    setTools(prev => prev.filter(t => t.id !== id))

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

  const handleSubmit = () => {
    onSubmit({ tools, teamSize, useCase })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Team Size</Label>
          <Input
            type="number"
            min={1}
            value={teamSize}
            onChange={e => setTeamSize(Number(e.target.value))}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>Primary Use Case</Label>
          <Select value={useCase} onValueChange={v => setUseCase(v as UseCase)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USE_CASE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Your AI Tools</Label>
          <Badge variant="secondary">
            Total: ${totalMonthly.toFixed(0)}/mo
          </Badge>
        </div>

        {tools.map((tool, index) => (
          <Card key={tool.id} className="border border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tool {index + 1}
                </CardTitle>
                {tools.length > 1 && (
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tool</Label>
                  <Select
                    value={tool.toolName}
                    onValueChange={v => {
                      const newTool = v as ToolName
                      const firstPlan = Object.keys(PRICING_DATA[newTool]?.plans ?? {})[0] ?? 'pro'
                      const firstPrice = PRICING_DATA[newTool]?.plans[firstPlan]?.pricePerSeat ?? 0
                      updateTool(tool.id, {
                        toolName: newTool,
                        plan: firstPlan,
                        monthlySpend: firstPrice * tool.seats
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOOL_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Plan</Label>
                  <Select
                    value={tool.plan}
                    onValueChange={v => {
                      const price = PRICING_DATA[tool.toolName]?.plans[v]?.pricePerSeat ?? 0
                      updateTool(tool.id, {
                        plan: v,
                        monthlySpend: price * tool.seats
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getPlansForTool(tool.toolName).map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Seats</Label>
                  <Input
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={e => {
                      const seats = Number(e.target.value)
                      const price = PRICING_DATA[tool.toolName]?.plans[tool.plan]?.pricePerSeat ?? 0
                      updateTool(tool.id, {
                        seats,
                        monthlySpend: price * seats
                      })
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Monthly Spend ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={tool.monthlySpend}
                    onChange={e =>
                      updateTool(tool.id, { monthlySpend: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={addTool}
        >
          <Plus size={15} className="mr-2" />
          Add another tool
        </Button>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={isLoading || tools.length === 0}
      >
        {isLoading ? (
          'Analyzing your spend...'
        ) : (
          <>
            <Zap size={16} className="mr-2" />
            Run Free Audit
          </>
        )}
      </Button>
    </div>
  )
}