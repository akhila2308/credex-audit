'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, X } from 'lucide-react'

interface LeadCaptureProps {
  auditId: string
  totalMonthlySavings: number
  onClose: () => void
}

export default function LeadCapture({ auditId, totalMonthlySavings, onClose }: LeadCaptureProps) {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) {
      setError('Email is required')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          website, // honeypot field
          auditId
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong')
        return
      }

      setIsSuccess(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="border border-border">
        <CardContent className="p-6 text-center space-y-3">
          <CheckCircle className="mx-auto text-green-600" size={36} />
          <h3 className="font-bold text-lg">You're all set</h3>
          <p className="text-sm text-muted-foreground">
            We've sent your audit report to <span className="font-medium text-foreground">{email}</span>.
            {totalMonthlySavings > 500 && (
              <> Our team will reach out shortly about Credex credits.</>
            )}
          </p>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Back to results
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {totalMonthlySavings > 500
              ? 'Get your report + Credex consultation'
              : 'Get your full report'}
          </CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Honeypot - hidden from real users */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-1">
          <Label className="text-xs">Work Email *</Label>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Company Name</Label>
          <Input
            placeholder="Acme Inc."
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Your Role</Label>
          <Input
            placeholder="CTO, Engineering Manager..."
            value={role}
            onChange={e => setRole(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send me the report'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          No spam. Unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  )
}