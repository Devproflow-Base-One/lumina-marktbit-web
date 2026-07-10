import { PricingCard } from '@/components/pricing/PricingCard'
import { PricingFAQ } from '@/components/pricing/PricingFAQ'
import { AdSlot } from '@/components/AdSlot'

export default function PricingPage() {
  const plans = [
    {
      name: 'free',
      displayName: 'Free',
      price: 0,
      period: 'selamanya',
      description: 'Mulai dengan sinyal dasar',
      features: [
        '1 sinyal/hari',
        'BTC only',
        'Dashboard access',
        'Community comments',
        'DEVFLO AI Consultant'
      ],
      limits: {
        signalsPerDay: 1,
        categories: ['crypto'],
        coins: ['BTC']
      },
      cta: 'Mulai Gratis',
      popular: false
    },
    {
      name: 'premium',
      displayName: 'Premium',
      price: 3,
      period: '/bulan',
      description: 'Akses penuh ke semua sinyal',
      features: [
        'Unlimited sinyal',
        'Semua coin & saham (Crypto, IDX, Global)',
        'Priority support',
        'Ad-free experience',
        'DEVFLO AI Consultant',
        'Backtest results',
        'Advanced indicators'
      ],
      limits: {
        signalsPerDay: -1,
        categories: ['crypto', 'stocks-id', 'stocks-global']
      },
      cta: 'Upgrade Premium',
      popular: true,
      yearlyPrice: 30,
      lifetimePrice: 99
    },
    {
      name: 'lifetime',
      displayName: 'Lifetime',
      price: 99,
      period: 'sekali bayar',
      description: 'Akses selamanya',
      features: [
        'Semua fitur Premium',
        'Akses selamanya (lifetime)',
        'Lifetime updates',
        'Priority support 24/7',
        'Ad-free forever',
        'Early access fitur baru',
        'Exclusive community'
      ],
      limits: {
        signalsPerDay: -1,
        categories: ['crypto', 'stocks-id', 'stocks-global'],
        lifetime: true
      },
      cta: 'Beli Lifetime',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Pilih Paket Sesuai Kebutuhan Anda
          </h1>
          <p className="text-xl text-gray-300">
            Mulai gratis, upgrade kapan saja. Tanpa kontrak, batalkan kapan saja.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-blue-900/20 border border-blue-800 rounded-lg p-6 mb-16">
          <h3 className="text-xl font-bold text-blue-200 mb-3">
            Penting untuk Diketahui
          </h3>
          <ul className="space-y-2 text-blue-100">
            <li>&#10003; <strong>MarktBit adalah platform monitoring &amp; edukasi</strong>, bukan platform trading</li>
            <li>&#10003; Anda <strong>TIDAK perlu</strong> deposit uang ke MarktBit untuk trading</li>
            <li>&#10003; Trading dilakukan di <strong>exchange pilihan Anda sendiri</strong> (Binance, Ajaib, dll)</li>
            <li>&#10003; Subscription hanya untuk <strong>mengakses sinyal &amp; fitur premium</strong></li>
            <li>&#10003; <strong>Tidak ada</strong> trading fee, commission, atau biaya tersembunyi</li>
            <li>&#10003; Anda bisa <strong>batalkan subscription kapan saja</strong></li>
          </ul>
        </div>

        {/* Native ad before FAQ */}
        <div className="max-w-4xl mx-auto mb-16">
          <AdSlot size="native" format="native" />
        </div>

        <PricingFAQ />

        {/* Affiliate banner at bottom */}
        <div className="max-w-4xl mx-auto mt-12">
          <AdSlot size="affiliate" />
        </div>
      </div>
    </div>
  )
}
