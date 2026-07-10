'use client'

import { useState } from 'react'

/**
 * Singularity Lead Capture Form
 * Collects email/phone and sends to LeadScorer via /api/god-mode/lead
 */
export function LeadCaptureForm({
  campaignId,
  source = 'landing_page',
  compact = false,
}: {
  campaignId?: string
  source?: string
  compact?: boolean
}) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email && !phone) {
      setError('Email or phone required')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/god-mode/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          name: name || undefined,
          channel: 'web',
          source,
          interests: ['crypto signals'],
          tags: campaignId ? [`campaign:${campaignId}`] : [],
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setEmail('')
        setPhone('')
        setName('')

        // Track conversion if campaignId provided
        if (campaignId) {
          await fetch('/api/god-mode/track/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId,
              channel: 'web',
              leadId: data.leadId,
              eventType: 'signup',
              revenue: 0,
            }),
          }).catch(() => {})
        }
      } else {
        setError(data.error || 'Failed to submit')
        setStatus('error')
      }
    } catch (e: any) {
      setError(e.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
        <p className="text-green-800 font-semibold">✅ Welcome aboard! Check your inbox for signals.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm text-green-600 hover:underline"
        >
          Sign up another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${compact ? '' : 'max-w-md mx-auto'}`}>
      {!compact && (
        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      )}
      <div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>
      {!compact && (
        <div>
          <input
            type="tel"
            placeholder="Phone (for WhatsApp signals)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Get Free Crypto Signals →'}
      </button>
      <p className="text-center text-xs text-gray-500">
        Join 10,000+ traders. No spam. Unsubscribe anytime.
      </p>
    </form>
  )
}
