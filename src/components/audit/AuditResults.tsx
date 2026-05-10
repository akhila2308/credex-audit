'use client'

import { AuditResult, ToolRecommendation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PRICING_DATA } from '@/lib/pricing-data'
import {
  TrendingDown,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react'

const ACTION_CONFIG = {
  downgrade: {
    label: 'Downgrade Plan',
    color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    icon: TrendingDown
  },
  switch: {
    label: 'Switch Tool',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    icon: ArrowRight
  },
  optimize: {
    label: 'Optimize Usage',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    icon: Sparkles
  },
  keep: {
    label: 'Already Optimal',
    color: 'bg-green-500/10 text-green-600 border-green-200',
    icon: CheckCircle
  }
}

interface AuditResultsProps {
  audit: AuditResult
  onCaptureLead: () => void
}

const RecommendationCard = ({ rec }: { rec: ToolRecommendation }) => {
  const config = ACTION_CONFIG[rec.recommendedAction]
  const Icon = config.icon
  const toolDisplay = PRICING_DATA[rec.toolName]?.displayName ?? rec.toolName
  const recToolDisplay = rec.recommendedTool
    ? (PRICING_DATA[rec.recommendedTool]?.displayName ?? rec.recommendedTool)
    : null

  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{toolDisplay}</span>
              <Badge variant="outline" className="text-xs">
                {rec.plan}
              </Badge>
              <Badge className={`text-xs border ${config.color}`}>
                <Icon size={11} className="mr-1" />
                {config.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="line-through">${rec.currentSpend}/mo</span>
              <ArrowRight size={12} />
              <span className="text-foreground font-medium">
                ${rec.projectedSpend.toFixed(0)}/mo
              </span>
              {recToolDisplay && (
                <>
                  <span>→</span>
                  <span className="text-blue-600 font-medium">{recToolDisplay}</span>
                  {rec.recommendedPlan && (
                    <Badge variant="outline" className="text-xs">
                      {rec.recommendedPlan}
                    </Badge>
                  )}
                </>
              )}
              {rec.recommendedPlan && !recToolDisplay && (
                <>
                  <span>→</span>
                  <Badge variant="outline" className="text-xs">
                    {rec.recommendedPlan}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {rec.reason}
            </p>
          </div>

          {rec.monthlySavings > 0 && (
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-green-600">
                ${rec.monthlySavings.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">saved/mo</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuditResults({ audit, onCaptureLead }: AuditResultsProps) {
  const isOptimal = audit.totalMonthlySavings < 100
  const isHighSavings = audit.totalMonthlySavings > 500

  return (
    <div className="space-y-6">
      {/* Hero savings block */}
      <Card className={`border-2 ${isOptimal ? 'border-green-200 bg-green-50/50' : 'border-primary/20 bg-primary/5'}`}>
        <CardContent className="p-6 text-center">
          {isOptimal ? (
            <>
              <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
              <h2 className="text-xl font-bold text-green-700">
                You're spending well
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your AI stack is already well-optimized. Minor tweaks could save{' '}
                <span className="font-semibold">
                  ${audit.totalMonthlySavings.toFixed(0)}/mo
                </span>
                .
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="mx-auto mb-2 text-primary" size={32} />
              <div className="text-4xl font-black text-primary">
                ${audit.totalMonthlySavings.toFixed(0)}
                <span className="text-lg font-normal text-muted-foreground">
                  /mo
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                potential monthly savings —{' '}
                <span className="font-semibold text-foreground">
                  ${audit.totalAnnualSavings.toFixed(0)}/year
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* AI Summary */}
      {audit.aiSummary && (
        <Card className="border border-border bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                AI Analysis
              </span>
            </div>
            <p className="text-sm leading-relaxed">{audit.aiSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Per-tool breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Tool Breakdown
        </h3>
        {audit.recommendations.map(rec => (
          <RecommendationCard key={rec.toolId} rec={rec} />
        ))}
      </div>

      {/* Credex CTA for high savings */}
      {isHighSavings && (
        <Card className="border-2 border-primary bg-primary text-primary-foreground">
          <CardContent className="p-5">
            <h3 className="font-bold text-lg mb-1">
              Save even more with Credex
            </h3>
            <p className="text-sm opacity-90 mb-4">
              You're overspending by ${audit.totalMonthlySavings.toFixed(0)}/mo at retail prices. Credex sources discounted AI credits from companies that overforecast — same tools, up to 40% off.
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.open('https://credex.rocks', '_blank')}
            >
              Book a free Credex consultation
              <ExternalLink size={14} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lead capture CTA */}
      <Card className="border border-border">
        <CardContent className="p-5 text-center space-y-3">
          <h3 className="font-semibold">
            {isOptimal
              ? 'Get notified when new optimizations apply to your stack'
              : 'Get your full report by email'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isOptimal
              ? "We'll reach out when better options become available for your tools."
              : 'Includes a detailed PDF breakdown and personalized recommendations.'}
          </p>
          <Button className="w-full" onClick={onCaptureLead}>
            {isOptimal ? 'Notify me' : 'Email me the full report'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}