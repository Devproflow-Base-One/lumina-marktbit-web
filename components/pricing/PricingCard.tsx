'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Plan {
  name: string
  displayName: string
  price: number
  period: string
  description: string
  features: string[]
  limits: Record<string, unknown>
  cta: string
  popular: boolean
  yearlyPrice?: number
  lifetimePrice?: number
}

interface Props {
  plan: Plan
}

export function PricingCard({ plan }: Props) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly')
  const router = useRouter()

  const getPrice = () => {
    if (plan.name === 'free') return 0
    if (plan.name === 'lifetime') return plan.price

    switch (billingPeriod) {
      case 'yearly':
        return plan.yearlyPrice || plan.price * 10
      case 'lifetime':
        return plan.lifetimePrice || plan.price * 30
      default:
        return plan.price
    }
  }

  const getPeriod = () => {
    if (plan.name === 'free') return 'selamanya'
    if (plan.name === 'lifetime') return 'sekali bayar'

    switch (billingPeriod) {
      case 'yearly':
        return '/tahun'
      case 'lifetime':
        return 'sekali bayar'
      default:
        return '/bulan'
    }
  }

  const handleSubscribe = async () => {
    if (plan.name === 'free') {
      router.push('/login?plan=free')
      return
    }

    router.push(`/checkout?plan=${plan.name}&billing=${billingPeriod}`)
  }

  return (
    <div className={`relative bg-gray-800 rounded-2xl p-8 ${
      plan.popular ? 'ring-2 ring-blue-500 shadow-2xl' : ''
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Paling Populer
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.displayName}</h3>
        <p className="text-gray-400 text-sm">{plan.description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-white">
            ${getPrice()}
          </span>
          <span className="text-gray-400">{getPeriod()}</span>
        </div>

        {plan.name === 'premium' && (
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1 rounded text-sm ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-3 py-1 rounded text-sm ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Tahunan (Hemat 17%)
            </button>
            <button
              onClick={() => setBillingPeriod('lifetime')}
              className={`px-3 py-1 rounded text-sm ${
                billingPeriod === 'lifetime'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Lifetime
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 mt-0.5">&#10003;</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          plan.popular
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        {plan.cta}
      </button>
    </div>
  )
}
