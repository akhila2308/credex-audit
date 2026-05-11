'use client'

import { useState } from 'react'
import SpendForm from '@/components/audit/SpendForm'
import AuditResults from '@/components/audit/AuditResults'
import LeadCapture from '@/components/audit/LeadCapture'
import ShareButton from '@/components/audit/ShareButton'
import { AuditInput, AuditResult } from '@/types'
import { Zap, TrendingDown, Shield, Clock, Sparkles } from 'lucide-react'

type Step = 'form' | 'results'

export default function Home() {
  const [step, setStep] = useState<Step>('form')
  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLeadCapture, setShowLeadCapture] = useState(false)

  const handleSubmit = async (input: AuditInput) => {
    setIsLoading(true)
    try {
      const auditRes = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      })
      const auditData: AuditResult = await auditRes.json()
      const summaryRes = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit: auditData })
      })
      const summaryData = await summaryRes.json()
      setAudit({ ...auditData, aiSummary: summaryData.summary })
      setStep('results')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 400, height: 400, top: -100, left: -100, background: 'rgba(168,184,240,0.25)' }} />
      <div className="orb" style={{ width: 300, height: 300, top: 200, right: -80, background: 'rgba(107,127,212,0.15)' }} />
      <div className="orb" style={{ width: 350, height: 350, bottom: -100, left: '30%', background: 'rgba(200,210,245,0.2)' }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(238,241,248,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 1px 0 rgba(107,127,212,0.08)'
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="glass-dark float" style={{
              width: 34, height: 34, borderRadius: '0.6rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={15} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--foreground)' }}>
              SpendLens
            </span>
          </div>
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '0.72rem', fontWeight: 500,
              color: 'var(--primary)',
              background: 'rgba(107,127,212,0.1)',
              border: '1px solid rgba(107,127,212,0.2)',
              padding: '0.3rem 0.75rem',
              borderRadius: '99px',
              textDecoration: 'none',
              letterSpacing: '0.02em'
            }}>
            by Credex →
          </a>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* Hero */}
            <div className="fade-up" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto',
                background: 'rgba(107,127,212,0.12)', border: '1px solid rgba(107,127,212,0.25)',
                borderRadius: '99px', padding: '0.35rem 1rem', fontSize: '0.72rem',
                fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Sparkles size={10} />
                Free AI Spend Audit
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: 'var(--foreground)',
                letterSpacing: '-0.02em'
              }}>
                Are you overpaying<br />
                <em style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #9aaae8 50%, #c4aef0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontStyle: 'italic'
                }}>
                  for AI tools?
                </em>
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', maxWidth: 440, margin: '0 auto', lineHeight: 1.65, fontWeight: 300 }}>
                Enter your current AI subscriptions and get an instant audit —
                where you're overspending, what to switch, and exactly how much you'd save.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { icon: TrendingDown, label: 'Avg savings', value: '$340/mo' },
                  { icon: Clock, label: 'Takes', value: '< 30 sec' },
                  { icon: Shield, label: 'Privacy', value: 'No data sold' }
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="glass-subtle" style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.4rem 0.9rem', borderRadius: '99px'
                  }}>
                    <Icon size={12} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {label}: <strong style={{ color: 'var(--foreground)', fontWeight: 500 }}>{value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass fade-up-2" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
              <SpendForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            <p className="fade-up-3" style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>
              Used by 500+ startup teams · No login required · Free forever
            </p>
          </div>
        )}

        {step === 'results' && audit && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => setStep('form')} style={{
                fontSize: '0.8rem', color: 'var(--muted-foreground)',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.3rem'
              }}>
                ← Edit inputs
              </button>
              <ShareButton auditId={audit.id} />
            </div>

            {showLeadCapture ? (
              <LeadCapture
                auditId={audit.id}
                totalMonthlySavings={audit.totalMonthlySavings}
                onClose={() => setShowLeadCapture(false)}
              />
            ) : (
              <AuditResults
                audit={audit}
                onCaptureLead={() => setShowLeadCapture(true)}
              />
            )}
          </div>
        )}
      </div>
    </main>
  )
}