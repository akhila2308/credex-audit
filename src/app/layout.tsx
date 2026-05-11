import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Spend Auditor',
  description:
    'Find out if your startup is overpaying for AI tools. Get an instant audit of your Cursor, Claude, ChatGPT, and GitHub Copilot spend.',
  openGraph: {
    title: 'SpendLens — Free AI Spend Auditor',
    description: 'Instant AI tool spend audit for startups. Free, no login required.',
    siteName: 'SpendLens by Credex',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens — Free AI Spend Auditor',
    description: 'Instant AI tool spend audit for startups. Free, no login required.'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}