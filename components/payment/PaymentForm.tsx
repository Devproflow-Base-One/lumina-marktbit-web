'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  plan: string
  billing: string
  amount: number
}

export function PaymentForm({ plan, billing, amount }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'crypto'>('stripe')

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billing,
          amount,
          paymentMethod
        })
      })

      const data = await response.json()

      if (data.success) {
        if (paymentMethod === 'stripe' && data.url) {
          window.location.href = data.url
        } else if (paymentMethod === 'paypal' && data.approvalUrl) {
          window.location.href = data.approvalUrl
        } else if (paymentMethod === 'crypto' && data.walletAddress) {
          router.push(`/payment/crypto?address=${data.walletAddress}&amount=${data.cryptoAmount}`)
        }
      } else {
        alert('Pembayaran gagal: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700">
          <input
            type="radio"
            name="paymentMethod"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'paypal' | 'crypto')}
            className="w-4 h-4"
          />
          <span className="text-white">Kredit/Debit Card (Stripe)</span>
        </label>

        <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'paypal' | 'crypto')}
            className="w-4 h-4"
          />
          <span className="text-white">PayPal</span>
        </label>

        <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700">
          <input
            type="radio"
            name="paymentMethod"
            value="crypto"
            checked={paymentMethod === 'crypto'}
            onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'paypal' | 'crypto')}
            className="w-4 h-4"
          />
          <span className="text-white">Cryptocurrency (BTC, ETH, USDT)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Memproses...' : `Bayar $${amount}`}
      </button>

      <div className="text-center text-sm text-gray-400">
        Pembayaran aman & terenkripsi
      </div>
    </form>
  )
}
