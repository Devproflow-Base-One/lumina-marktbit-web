'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { AdSlot } from '@/components/AdSlot'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'premium'
  const billing = searchParams.get('billing') || 'monthly'

  const [planDetails, setPlanDetails] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const planMap: Record<string, { displayName: string; priceMonthly: number; yearlyPrice: number; lifetimePrice: number; limits: { categories: string[] } }> = {
      free: { displayName: 'Free', priceMonthly: 0, yearlyPrice: 0, lifetimePrice: 0, limits: { categories: ['crypto'] } },
      premium: { displayName: 'Premium', priceMonthly: 3, yearlyPrice: 30, lifetimePrice: 99, limits: { categories: ['crypto', 'stocks-id', 'stocks-global'] } },
      lifetime: { displayName: 'Lifetime', priceMonthly: 99, yearlyPrice: 99, lifetimePrice: 99, limits: { categories: ['crypto', 'stocks-id', 'stocks-global'] } }
    }

    const details = planMap[plan] || planMap.premium
    setPlanDetails(details)
    setLoading(false)
  }, [plan])

  if (loading || !planDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const getPrice = () => {
    if (billing === 'yearly') return planDetails.yearlyPrice as number
    if (billing === 'lifetime') return planDetails.lifetimePrice as number
    return planDetails.priceMonthly as number
  }

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Paket:</span>
                <span className="font-semibold">{planDetails.displayName as string}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Periode:</span>
                <span>{billing === 'yearly' ? 'Tahunan' : billing === 'lifetime' ? 'Lifetime' : 'Bulanan'}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Akses:</span>
                <span>{(planDetails.limits as { categories: string[] }).categories.join(', ')}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-white text-xl font-bold">
                <span>Total:</span>
                <span>${getPrice()}</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded p-4">
              <p className="text-sm text-blue-200">
                <strong>Penting:</strong> Pembayaran ini hanya untuk subscription akses sinyal &amp; fitur premium.
                <strong> BUKAN</strong> untuk deposit trading. Trading dilakukan di exchange pilihan Anda sendiri.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Metode Pembayaran
            </h2>
            <PaymentForm
              plan={plan}
              billing={billing}
              amount={getPrice()}
            />
          </div>
        </div>

        {/* Affiliate banner — broker CTA */}
        <div className="max-w-4xl mx-auto mt-8">
          <AdSlot size="affiliate" />
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
