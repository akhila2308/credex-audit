'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Copy } from 'lucide-react'

interface ShareButtonProps {
  auditId: string
}

export default function ShareButton({ auditId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'My AI Spend Audit — SpendLens',
        text: 'I just audited my AI tool spend. See where I could save:',
        url: shareUrl
      })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
        {copied ? (
          <>
            <Check size={13} className="mr-1 text-green-600" />
            Copied
          </>
        ) : (
          <>
            <Copy size={13} className="mr-1" />
            Copy link
          </>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
        <Share2 size={13} className="mr-1" />
        Share
      </Button>
    </div>
  )
}