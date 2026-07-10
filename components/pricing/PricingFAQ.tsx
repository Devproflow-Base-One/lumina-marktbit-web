'use client'

import { useState } from 'react'

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Apakah MarktBit adalah platform trading?',
      a: 'TIDAK. MarktBit adalah platform monitoring & edukasi sinyal trading. Anda tidak dapat melakukan trading, deposit, atau withdraw di MarktBit. Trading dilakukan di exchange pilihan Anda sendiri (Binance, Ajaib, Interactive Brokers, dll).'
    },
    {
      q: 'Apa yang saya dapat dengan subscription?',
      a: 'Subscription memberi Anda akses ke sinyal trading, dashboard monitoring, analisis indikator, DEVFLO AI Consultant untuk edukasi, dan fitur premium lainnya. Anda TIDAK membayar untuk trading.'
    },
    {
      q: 'Apakah ada biaya tersembunyi?',
      a: 'Tidak ada. Subscription hanya untuk akses fitur. Tidak ada trading fee, commission, atau biaya tersembunyi. Anda bisa batalkan kapan saja.'
    },
    {
      q: 'Apakah saya perlu deposit uang ke MarktBit?',
      a: 'TIDAK PERNAH. MarktBit tidak menerima deposit untuk trading. Pembayaran hanya untuk subscription (Free/Premium/Lifetime).'
    },
    {
      q: 'Bagaimana cara menggunakan sinyal MarktBit?',
      a: '1) Lihat sinyal di dashboard MarktBit. 2) Buka exchange pilihan Anda (Binance, Ajaib, dll). 3) Lakukan trading manual berdasarkan sinyal tersebut. MarktBit hanya memberikan sinyal, bukan mengeksekusi trading.'
    },
    {
      q: 'Apakah sinyal MarktBit dijamin akurat?',
      a: 'Tidak. Sinyal adalah hasil analisis AI dan teknikal, namun pasar selalu berisiko. Selalu lakukan riset sendiri dan gunakan manajemen risiko. Tidak ada jaminan profit.'
    },
    {
      q: 'Bisakah saya membatalkan subscription?',
      a: 'Ya, Anda dapat membatalkan kapan saja. Tidak ada kontrak jangka panjang. Pembatalan berlaku untuk periode berikutnya.'
    },
    {
      q: 'Apa metode pembayaran yang tersedia?',
      a: 'Kami menerima Kartu Kredit/Debit (Stripe), PayPal, dan Cryptocurrency (BTC, ETH, USDT).'
    }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Pertanyaan yang Sering Diajukan
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-4 text-left flex justify-between items-center"
            >
              <span className="text-white font-semibold">{faq.q}</span>
              <span className="text-gray-400 text-xl">
                {openIndex === i ? '-' : '+'}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4 text-gray-300 text-sm">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
