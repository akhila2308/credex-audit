'use client'

import { AuditResult, ToolRecommendation } from '@/types'
import { PRICING_DATA } from '@/lib/pricing-data'
import {
  TrendingDown, ArrowRight, CheckCircle,
  AlertCircle, Sparkles, ExternalLink
} from 'lucide-react'

const ACTION_CONFIG = {
  downgrade: { label: 'Downgrade Plan', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' },
  switch: { label: 'Switch Tool', color: '#6b7fd4', bg: 'rgba(107,127,212,0.08)', border: 'rgba(107,127,212,0.2)' },
  optimize: { label: 'Optimize Usage', color: '#7c6aff', bg: 'rgba(124,106,255,0.08)', border: 'rgba(124,106,255,0.2)' },
  keep: { label: 'Already Optimal', color: '#4caf88', bg: 'rgba(76,175,136,0.08)', border: 'rgba(76,175,136,0.2)' }
}

const RecommendationCard = ({ rec }: { rec: ToolRecommendation }) => {
  const config = ACTION_CONFIG[rec.recommendedAction]
  const toolDisplay = PRICING_DATA[rec.toolName]?.displayName ?? rec.toolName
  const recToolDisplay = rec.recommendedTool
    ? (PRICING_DATA[rec.recommendedTool]?.displayName ?? rec.recommendedTool)
    : null

  return (
    <div className="glass" style={{ borderRadius: '1rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>{toolDisplay}</span>
            <span style={{
              fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '99px',
              background: 'rgba(107,127,212,0.1)', color: 'var(--primary)',
              border: '1px solid rgba(107,127,212,0.2)', fontWeight: 500
            }}>{rec.plan}</span>
            <span style={{
              fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '99px',
              background: config.bg, color: config.color,
              border: `1px solid ${config.border}`, fontWeight: 600
            }}>{config.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <span style={{ textDecoration: 'line-through', color: 'var(--muted-foreground)' }}>${rec.currentSpend}/mo</span>
            <ArrowRight size={11} color="var(--muted-foreground)" />
            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>${rec.projectedSpend.toFixed(0)}/mo</span>
            {recToolDisplay && (
              <>
                <span style={{ color: 'var(--muted-foreground)' }}>→</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{recToolDisplay}</span>
              </>
            )}
            {rec.recommendedPlan && !recToolDisplay && (
              <>
                <span style={{ color: 'var(--muted-foreground)' }}>→</span>
                <span style={{
                  fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '99px',
                  background: 'rgba(107,127,212,0.1)', color: 'var(--primary)',
                  border: '1px solid rgba(107,127,212,0.2)'
                }}>{rec.recommendedPlan}</span>
              </>
            )}
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
            {rec.reason}
          </p>
        </div>

        {rec.monthlySavings > 0 && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4caf88', fontFamily: 'var(--font-display)' }}>
              ${rec.monthlySavings.toFixed(0)}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>saved/mo</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuditResults({ audit, onCaptureLead }: { audit: AuditResult; onCaptureLead: () => void }) {
  const isOptimal = audit.totalMonthlySavings < 100
  const isHighSavings = audit.totalMonthlySavings > 500

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Hero savings */}
      <div className="glass" style={{
        borderRadius: '1.5rem', padding: '2rem', textAlign: 'center',
        background: isOptimal
          ? 'rgba(76,175,136,0.08)'
          : 'rgba(107,127,212,0.08)',
        border: isOptimal
          ? '1px solid rgba(76,175,136,0.25)'
          : '1px solid rgba(107,127,212,0.25)'
      }}>
        {isOptimal ? (
          <>
            <CheckCircle size={36} color="#4caf88" style={{ margin: '0 auto 0.75rem' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: '#4caf88' }}>
              You're spending well
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.4rem' }}>
              Your AI stack is well-optimized. Minor tweaks could save{' '}
              <strong>${audit.totalMonthlySavings.toFixed(0)}/mo</strong>.
            </p>
          </>
        ) : (
          <>
            <AlertCircle size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 400, fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--primary), #c4aef0)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ${audit.totalMonthlySavings.toFixed(0)}<span style={{ fontSize: '1.2rem', WebkitTextFillColor: 'var(--muted-foreground)' }}>/mo</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              potential monthly savings —{' '}
              <strong style={{ color: 'var(--foreground)' }}>${audit.totalAnnualSavings.toFixed(0)}/year</strong>
            </p>
          </>
        )}
      </div>

      {/* AI Summary */}
      {audit.aiSummary && (
        <div className="glass-subtle" style={{ borderRadius: '1rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <Sparkles size={13} color="var(--primary)" />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
              AI Analysis
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--foreground)' }}>{audit.aiSummary}</p>
        </div>
      )}

      {/* Breakdown */}
      <div>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
          Tool Breakdown
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {audit.recommendations.map(rec => (
            <RecommendationCard key={rec.toolId} rec={rec} />
          ))}
        </div>
      </div>

      {/* Credex CTA */}
      {isHighSavings && (
        <div className="glass-dark" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'white', marginBottom: '0.5rem' }}>
            Save even more with Credex
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            You're overspending ${audit.totalMonthlySavings.toFixed(0)}/mo at retail. Credex sources discounted AI credits from companies that overforecast — same tools, up to 40% off.
          </p>
          <button
            onClick={() => window.open('https://credex.rocks', '_blank')}
            style={{
              width: '100%', padding: '0.75rem',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '0.75rem', color: 'white',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            Book a free Credex consultation
            <ExternalLink size={13} />
          </button>
        </div>
      )}

      {/* Lead capture CTA */}
      <div className="glass" style={{ borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.4rem' }}>
          {isOptimal ? 'Get notified when better options arrive' : 'Get your full report by email'}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem', lineHeight: 1.6 }}>
          {isOptimal
            ? "We'll reach out when better options become available for your stack."
            : 'Detailed PDF breakdown with personalized recommendations.'}
        </p>
        <button
          onClick={onCaptureLead}
          style={{
            width: '100%', padding: '0.75rem',
            background: 'linear-gradient(135deg, var(--primary), #9aaae8)',
            border: 'none', borderRadius: '0.75rem',
            color: 'white', fontSize: '0.88rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 20px rgba(107,127,212,0.3)',
            transition: 'opacity 0.2s'
          }}
        >
          {isOptimal ? 'Notify me' : 'Email me the full report'}
        </button>
      </div>
    </div>
  )
}