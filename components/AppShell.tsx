'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import CryptoAssistant from '@/components/CryptoAssistant'
import { ReferralCard } from '@/components/ReferralCard'
import { FOMOCounter } from '@/components/FOMOCounter'
import { AdSlot } from '@/components/AdSlot'
import { StickyAdBar } from '@/components/StickyAdBar'
import { signalAPI, Signal } from '@/lib/signal-api'
import { TrendingUp, Landmark, Zap, Play } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [latestSignal, setLatestSignal] = useState<Signal | null>(null)

  useEffect(() => {
    async function fetchLatest() {
      try {
        const data = await signalAPI.getSignals(1)
        if (data.signals && data.signals.length > 0) {
          setLatestSignal(data.signals[0])
        }
      } catch {
        // Silent fail
      }
    }
    fetchLatest()
    const interval = setInterval(fetchLatest, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header — full width */}
        <TopHeader />

        {/* Content + Sidebars */}
        <div className="flex flex-1 min-h-0">
          {/* Left Ad Sidebar — hidden on mobile/tablet */}
          <aside className="hidden xl:flex flex-col gap-2 p-2 border-r border-border bg-card/30 w-44 flex-shrink-0 overflow-y-auto">
        {/* === CRYPTO ADS (LEFT) === */}
        <p className="text-[9px] font-bold text-yellow-500/40 uppercase tracking-widest text-center pt-1">Crypto</p>

        {/* HypeLab — Video 300×250 (SAMPLE) */}
        <div className="flex-1 flex flex-col min-h-[150px] rounded-lg border border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-yellow-600/5 p-2 overflow-hidden relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">HypeLab</p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-black">₿</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">Buy Bitcoin on Binance</p>
              <p className="text-[9px] text-green-500">BTC ↑ $67,420 +2.4%</p>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
            Start with $5. Lowest fees 0.1%. 300+ coins.
          </p>
          <div className="mb-1.5">
            <svg viewBox="0 0 100 20" className="w-full h-5" preserveAspectRatio="none">
              <polyline points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1" fill="none" stroke="rgb(34 197 94 / 0.6)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <polyline points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1 95,20 5,20" fill="rgb(34 197 94 / 0.06)" stroke="none" />
            </svg>
            <div className="flex justify-between mt-0.5">
              <span className="text-[8px] text-muted-foreground/40">$65,840</span>
              <span className="text-[8px] text-green-500/60">$67,420 ↑2.4%</span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="w-full bg-yellow-500 hover:bg-yellow-400 rounded text-center py-1 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold text-black">Open Free Account →</p>
            </div>
            <p className="text-[8px] text-muted-foreground/30 text-center mt-0.5">$8-15+ eCPM · est. $80-150/mo</p>
          </div>
        </div>

        {/* Bitmedia */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-yellow-500/20 bg-gradient-to-b from-yellow-500/8 to-yellow-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Bitmedia</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-black">ETH</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Stake ETH Earn 4.2% APY</p>
              <p className="text-[8px] text-green-500">ETH $3,245 ↑1.8%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Liquid staking. No lock-up. Daily rewards.</p>
          <div className="mt-auto">
            <div className="w-full bg-yellow-600/80 hover:bg-yellow-500 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Stake Now →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$4-8 eCPM · est. $40-80/mo</p>
          </div>
        </div>

        {/* Coin.Network */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-yellow-500/20 bg-gradient-to-b from-yellow-500/8 to-yellow-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Coin.Network</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">SOL</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Trade SOL on Bybit</p>
              <p className="text-[8px] text-green-500">SOL $172.30 ↑5.2%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">0 fees first 30 days. Up to 50x leverage.</p>
          <div className="mt-auto">
            <div className="w-full bg-orange-500/80 hover:bg-orange-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Trade Now →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$5-10 eCPM · est. $50-100/mo</p>
          </div>
        </div>

        {/* A-ADS */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-yellow-500/20 bg-gradient-to-b from-yellow-500/8 to-yellow-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">A-ADS</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">DOT</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Polkadot DeFi Yield</p>
              <p className="text-[8px] text-green-500">DOT $6.85 ↑3.4%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Earn 12% APY on DOT staking pools.</p>
          <div className="mt-auto">
            <div className="w-full bg-blue-500/80 hover:bg-blue-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Start Earning →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$1-4 eCPM · est. $10-40/mo</p>
          </div>
        </div>

        {/* RITS Ads */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-yellow-500/20 bg-gradient-to-b from-yellow-500/8 to-yellow-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">RITS Ads</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">AVAX</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Avalanche Speed Run</p>
              <p className="text-[8px] text-green-500">AVAX $38.50 ↑4.1%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Sub-second transactions. DeFi ready.</p>
          <div className="mt-auto">
            <div className="w-full bg-purple-500/80 hover:bg-purple-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Try AVAX →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$2-5 eCPM · est. $20-50/mo</p>
          </div>
        </div>

        {/* === STOCK ADS (LEFT) === */}
        <p className="text-[9px] font-bold text-blue-500/40 uppercase tracking-widest text-center pt-1">Stocks</p>

        {/* RichAds (SAMPLE) */}
        <div className="flex-1 flex flex-col min-h-[150px] rounded-lg border border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-blue-600/5 p-2 overflow-hidden relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-blue-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">RichAds</p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">RH</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">Trade Saham US Zero Commission</p>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
            Invest $10 in AAPL, TSLA, NVDA. Fractional shares.
          </p>
          <div className="mb-1.5">
            <svg viewBox="0 0 100 20" className="w-full h-5" preserveAspectRatio="none">
              <polyline points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1" fill="none" stroke="rgb(34 197 94 / 0.6)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <polyline points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1 95,20 5,20" fill="rgb(34 197 94 / 0.06)" stroke="none" />
            </svg>
            <div className="flex justify-between mt-0.5">
              <span className="text-[8px] text-muted-foreground/40">AAPL $182.40</span>
              <span className="text-[8px] text-green-500/60">NVDA $875.20 ↑3.1%</span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="w-full bg-blue-600 hover:bg-blue-500 rounded text-center py-1 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold text-white">Open Free Account →</p>
            </div>
            <p className="text-[8px] text-muted-foreground/30 text-center mt-0.5">$2-8 eCPM · est. $20-80/mo</p>
          </div>
        </div>

        {/* 7SearchPPC */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-blue-500/20 bg-gradient-to-b from-blue-500/8 to-blue-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-blue-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">7SearchPPC</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">TSLA</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Tesla Q3 Earnings Beat</p>
              <p className="text-[8px] text-green-500">TSLA $248.50 ↑6.3%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Trade US stocks 24/5. Zero commission.</p>
          <div className="mt-auto">
            <div className="w-full bg-green-600/80 hover:bg-green-500 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Trade Now →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$0.5-3 eCPM · est. $5-30/mo</p>
          </div>
        </div>

        {/* Media.net */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-blue-500/20 bg-gradient-to-b from-blue-500/8 to-blue-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-blue-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Media.net</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">NVDA</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Nvidia AI Boom Continues</p>
              <p className="text-[8px] text-green-500">NVDA $875.20 ↑3.1%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Invest in AI leader. Fractional shares from $5.</p>
          <div className="mt-auto">
            <div className="w-full bg-red-500/80 hover:bg-red-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Invest Now →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$2-10 eCPM · est. $20-100/mo</p>
          </div>
        </div>

        {/* Adsterra Native */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-blue-500/20 bg-gradient-to-b from-blue-500/8 to-blue-600/3 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-blue-500/40 uppercase tracking-wider">Ad · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Adsterra</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">AAPL</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Apple Vision Pro Launch</p>
              <p className="text-[8px] text-green-500">AAPL $182.40 ↑1.2%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Buy AAPL fractional shares. $5 minimum.</p>
          <div className="mt-auto">
            <div className="w-full bg-indigo-500/80 hover:bg-indigo-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">Buy AAPL →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$1.50-2.80 eCPM · est. $15-28/mo</p>
          </div>
        </div>

        {/* === MEME COINS === */}
        <p className="text-[9px] font-bold text-orange-500/50 uppercase tracking-widest text-center pt-1">🔥 Meme Coins</p>

        {/* PEPE */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-orange-500/30 bg-gradient-to-b from-orange-500/15 to-red-600/5 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-orange-500/50 uppercase tracking-wider">🔥 Hot · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Bitmedia</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center flex-shrink-0 text-[10px]">🐸</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">PEPE 1000x Potential?</p>
              <p className="text-[8px] text-green-500">PEPE $0.0000124 ↑18.5%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Next Doge? Don't miss the moon shot.</p>
          <div className="mt-auto">
            <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">🚀 Buy PEPE →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$8-15 eCPM · viral</p>
          </div>
        </div>

        {/* WIF */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-orange-500/30 bg-gradient-to-b from-orange-500/15 to-pink-600/5 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-orange-500/50 uppercase tracking-wider">🔥 Hot · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Coin.Network</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0 text-[10px]">🐕</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">dogwifhat WIF Pump</p>
              <p className="text-[8px] text-green-500">WIF $3.42 ↑12.3%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Solana meme king. 200% this week.</p>
          <div className="mt-auto">
            <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">🚀 Buy WIF →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$6-12 eCPM · viral</p>
          </div>
        </div>

        {/* BONK */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-orange-500/30 bg-gradient-to-b from-orange-500/15 to-amber-600/5 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-orange-500/50 uppercase tracking-wider">🔥 Hot · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">A-ADS</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center flex-shrink-0 text-[10px]">🦴</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">BONK Free Claim</p>
              <p className="text-[8px] text-green-500">BONK $0.000028 ↑7.8%</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Free BONK airdrop for Solana holders.</p>
          <div className="mt-auto">
            <div className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-black">🚀 Claim BONK →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$4-8 eCPM · no verify</p>
          </div>
        </div>

        {/* === AIRDROPS === */}
        <p className="text-[9px] font-bold text-purple-500/50 uppercase tracking-widest text-center pt-1">🎁 Airdrops</p>

        {/* Arbitrum ARB */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-purple-500/30 bg-gradient-to-b from-purple-500/15 to-indigo-600/5 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-purple-500/50 uppercase tracking-wider">🎁 Free · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">RITS Ads</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 text-[10px]">⚡</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Arbitrum ARB Claim</p>
              <p className="text-[8px] text-purple-400">Live now · ends in 3 days</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Free ARB tokens for eligible wallets. Check now.</p>
          <div className="mt-auto">
            <div className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">🎁 Check Eligibility →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$3-6 eCPM · high CTR</p>
          </div>
        </div>

        {/* Starknet STRK */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-purple-500/30 bg-gradient-to-b from-purple-500/15 to-violet-600/5 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-purple-500/50 uppercase tracking-wider">🎁 Free · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">HilltopAds</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 text-[10px]">🔮</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">Starknet STRK Drop</p>
              <p className="text-[8px] text-purple-400">Phase 2 · claim open</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">ZK-rollup airdrop. Bridge & claim free STRK.</p>
          <div className="mt-auto">
            <div className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">🎁 Claim STRK →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$3-6 eCPM · high CTR</p>
          </div>
        </div>

        {/* LayerZero ZRO */}
        <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-purple-500/30 bg-gradient-to-b from-purple-500/15 to-fuchsia-600/5 p-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-purple-500/50 uppercase tracking-wider">🎁 Free · 300×250</p>
            <p className="text-[8px] text-muted-foreground/30">Adsterra</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-fuchsia-500 to-pink-700 flex items-center justify-center flex-shrink-0 text-[10px]">🌐</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-foreground truncate">LayerZero ZRO Drop</p>
              <p className="text-[8px] text-purple-400">Final round · don't miss</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground leading-tight mb-1">Cross-chain protocol airdrop. Stake to qualify.</p>
          <div className="mt-auto">
            <div className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 rounded text-center py-0.5 transition-colors cursor-pointer">
              <p className="text-[9px] font-bold text-white">🎁 Get ZRO →</p>
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center mt-0.5">$3-6 eCPM · high CTR</p>
          </div>
        </div>

        {/* === LUMINA PRODUCTS === */}
        <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-widest text-center pt-1">Lumina Products</p>

        {/* Overmind */}
        <div className="flex-1 flex flex-col min-h-[110px] rounded-lg border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-cyan-600/5 p-2 overflow-hidden relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-cyan-500/40 uppercase tracking-wider">Product</p>
            <p className="text-[8px] text-muted-foreground/30">Lumina</p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">OM</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">Overmind API</p>
              <p className="text-[9px] text-cyan-500/60">Core Intelligence Engine</p>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
            AI orchestration, analytics, automation hub.
          </p>
          <div className="mt-auto">
            <div className="w-full bg-cyan-600 hover:bg-cyan-500 rounded text-center py-1 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold text-white">Learn More →</p>
            </div>
          </div>
        </div>

        {/* DevFlo */}
        <div className="flex-1 flex flex-col min-h-[110px] rounded-lg border border-violet-500/30 bg-gradient-to-b from-violet-500/10 to-violet-600/5 p-2 overflow-hidden relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-violet-500/40 uppercase tracking-wider">Product</p>
            <p className="text-[8px] text-muted-foreground/30">Lumina</p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">DF</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">DevFlo</p>
              <p className="text-[9px] text-violet-500/60">Dev Workflow Platform</p>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
            Code, deploy, manage. All-in-one dev tools.
          </p>
          <div className="mt-auto">
            <div className="w-full bg-violet-600 hover:bg-violet-500 rounded text-center py-1 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold text-white">Learn More →</p>
            </div>
          </div>
        </div>

        {/* MarktBit */}
        <div className="flex-1 flex flex-col min-h-[110px] rounded-lg border border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-orange-600/5 p-2 overflow-hidden relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Product</p>
            <p className="text-[8px] text-muted-foreground/30">Lumina</p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-black">MB</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">MarktBit</p>
              <p className="text-[9px] text-yellow-500/60">Signal Provider Platform</p>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
            Crypto & stock signals. Real-time alerts.
          </p>
          <div className="mt-auto">
            <div className="w-full bg-yellow-500 hover:bg-yellow-400 rounded text-center py-1 transition-colors cursor-pointer">
              <p className="text-[10px] font-bold text-black">Learn More →</p>
            </div>
          </div>
        </div>
      </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 overflow-y-auto p-6">
            {children}
          </main>

          {/* Right Sidebar — hidden on mobile/tablet */}
          <aside className="hidden xl:flex flex-col gap-2 p-3 border-l border-border bg-card/30 w-48 flex-shrink-0 overflow-y-auto">
            <FOMOCounter />
            <ReferralCard />

            {/* === CRYPTO vs STOCK COMPARISON === */}
            <div className="rounded-lg border border-border bg-card/50 p-1.5">
              <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-wider text-center mb-1">Revenue eCPM</p>
              {/* Crypto */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[8px] font-bold text-yellow-500/80 w-10">Crypto</span>
                <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full bg-yellow-500/60" style={{width: '95%'}}></div>
                </div>
                <span className="text-[8px] text-green-500/60 w-10 text-right">$8-15+</span>
              </div>
              {/* Stocks */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[8px] font-bold text-blue-500/80 w-10">Stocks</span>
                <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500/60" style={{width: '55%'}}></div>
                </div>
                <span className="text-[8px] text-green-500/60 w-10 text-right">$2-8</span>
              </div>
              {/* Video */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[8px] font-bold text-purple-500/80 w-10">Video</span>
                <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500/60" style={{width: '100%'}}></div>
                </div>
                <span className="text-[8px] text-green-500/60 w-10 text-right">$25</span>
              </div>
              {/* Popunder */}
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-bold text-orange-500/80 w-10">Pop</span>
                <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500/60" style={{width: '40%'}}></div>
                </div>
                <span className="text-[8px] text-green-500/60 w-10 text-right">$2-6</span>
              </div>
            </div>

            {/* === CRYPTO ADS === */}
            <p className="text-[9px] font-bold text-yellow-500/40 uppercase tracking-widest text-center pt-1">Crypto Ads</p>

            {/* HypeLab — Display Premium 300×250 (SAMPLE FILLED) */}
            <div className="flex-1 flex flex-col min-h-[180px] rounded-lg border border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-yellow-600/5 p-2 overflow-hidden relative">
              {/* Ad label */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-[8px] text-yellow-500/40 uppercase tracking-wider">Ad · 300×250</p>
                <p className="text-[8px] text-muted-foreground/30">HypeLab</p>
              </div>
              {/* Ad content */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-black">₿</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground truncate">Buy Bitcoin on Binance</p>
                  <p className="text-[9px] text-green-500">BTC ↑ $67,420 +2.4%</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
                Start with $5. Lowest fees 0.1%. 300+ coins available.
              </p>
              {/* Mock price line chart */}
              <div className="mb-1.5">
                <svg viewBox="0 0 100 20" className="w-full h-5" preserveAspectRatio="none">
                  <polyline
                    points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1"
                    fill="none"
                    stroke="rgb(34 197 94 / 0.6)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1 95,20 5,20"
                    fill="rgb(34 197 94 / 0.06)"
                    stroke="none"
                  />
                </svg>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[8px] text-muted-foreground/40">$65,840</span>
                  <span className="text-[8px] text-green-500/60">$67,420 ↑2.4%</span>
                </div>
              </div>
              {/* CTA */}
              <div className="mt-auto">
                <div className="w-full bg-yellow-500 hover:bg-yellow-400 rounded text-center py-1 transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-black">Open Free Account →</p>
                </div>
                <p className="text-[8px] text-muted-foreground/30 text-center mt-0.5">$8-15+ eCPM · est. $80-150/mo</p>
              </div>
            </div>

            {/* Bitmedia — Display Premium */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-yellow-500/20 bg-yellow-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-yellow-500/80">Bitmedia</p>
              <p className="text-[9px] text-yellow-500/40">Display · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$4-8 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $40-80/mo</p>
            </div>

            {/* Coin.Network — Display Premium */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-yellow-500/20 bg-yellow-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-yellow-500/80">Coin.Network</p>
              <p className="text-[9px] text-yellow-500/40">Display · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$5-10 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $50-100/mo</p>
            </div>

            {/* Coinzilla — Native */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-green-500/20 bg-green-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-green-500/80">Coinzilla</p>
              <p className="text-[9px] text-green-500/40">Native · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$3-8 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $30-80/mo</p>
            </div>

            {/* A-ADS — Display Standard */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-yellow-500/20 bg-yellow-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-yellow-500/80">A-ADS</p>
              <p className="text-[9px] text-yellow-500/40">Display · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$1-4 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $10-40/mo · no verify</p>
            </div>

            {/* RITS Ads — Display RTB */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-yellow-500/20 bg-yellow-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-yellow-500/80">RITS Ads</p>
              <p className="text-[9px] text-yellow-500/40">Display RTB · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2-5 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $20-50/mo · 300+ DSP</p>
            </div>

            {/* Coinzilla — Sticky Box */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-green-500/20 bg-green-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-green-500/80">Coinzilla</p>
              <p className="text-[9px] text-green-500/40">Sticky Box · 120×600</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2-6 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $20-60/mo</p>
            </div>

            {/* Coinzilla — Cryptobar */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-green-500/20 bg-green-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-green-500/80">Coinzilla</p>
              <p className="text-[9px] text-green-500/40">Cryptobar · 728×90</p>
              <p className="text-[9px] text-green-500/50 mt-1">$1.50-4 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $15-40/mo</p>
            </div>

            {/* === STOCK ADS === */}
            <p className="text-[9px] font-bold text-blue-500/40 uppercase tracking-widest text-center pt-1">Stock Ads</p>

            {/* RichAds — Display Premium (SAMPLE FILLED) */}
            <div className="flex-1 flex flex-col min-h-[160px] rounded-lg border border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-blue-600/5 p-2 overflow-hidden relative">
              {/* Ad label */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-[8px] text-blue-500/40 uppercase tracking-wider">Ad · 300×250</p>
                <p className="text-[8px] text-muted-foreground/30">RichAds</p>
              </div>
              {/* Ad content */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-white">RH</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground truncate">Trade Saham US Zero Commission</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-tight mb-1.5">
                Invest $10 in AAPL, TSLA, NVDA. Fractional shares. No minimum deposit.
              </p>
              {/* Mock price line chart */}
              <div className="mb-1.5">
                <svg viewBox="0 0 100 20" className="w-full h-5" preserveAspectRatio="none">
                  <polyline
                    points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1"
                    fill="none"
                    stroke="rgb(34 197 94 / 0.6)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points="5,17 16,14 27,15 39,10 50,12 62,7 74,4 86,2 95,1 95,20 5,20"
                    fill="rgb(34 197 94 / 0.06)"
                    stroke="none"
                  />
                </svg>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[8px] text-muted-foreground/40">AAPL $182.40</span>
                  <span className="text-[8px] text-green-500/60">NVDA $875.20 ↑3.1%</span>
                </div>
              </div>
              {/* CTA */}
              <div className="mt-auto">
                <div className="w-full bg-blue-600 hover:bg-blue-500 rounded text-center py-1 transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-white">Open Free Account →</p>
                </div>
                <p className="text-[8px] text-muted-foreground/30 text-center mt-0.5">$2-8 eCPM · est. $20-80/mo</p>
              </div>
            </div>

            {/* 7SearchPPC — Display */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-blue-500/20 bg-blue-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-blue-500/80">7SearchPPC</p>
              <p className="text-[9px] text-blue-500/40">Display · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$0.5-3 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $5-30/mo</p>
            </div>

            {/* Adsterra — Native Banner Stocks */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-blue-500/20 bg-blue-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-blue-500/80">Adsterra</p>
              <p className="text-[9px] text-blue-500/40">Native · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$1.50-2.80 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $15-28/mo</p>
            </div>

            {/* Media.net — Contextual Stocks */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-blue-500/20 bg-blue-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-blue-500/80">Media.net</p>
              <p className="text-[9px] text-blue-500/40">Contextual · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2-10 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $20-100/mo · US/UK</p>
            </div>

            {/* === VIDEO ADS === */}
            <p className="text-[9px] font-bold text-purple-500/40 uppercase tracking-widest text-center pt-1">Video Ads</p>

            {/* Adsterra — Video */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-purple-500/20 bg-purple-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-purple-500/80">Adsterra</p>
              <p className="text-[9px] text-purple-500/40">Video · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">up to $25 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $100-250/mo</p>
            </div>

            {/* HilltopAds — Video Outstream */}
            <div className="flex-1 flex flex-col min-h-[120px] rounded-lg border border-dashed border-purple-500/20 bg-purple-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-purple-500/80">HilltopAds</p>
              <p className="text-[9px] text-purple-500/40">Video · 300×250</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2.40 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">payout mingguan · BTC</p>
            </div>

            {/* HilltopAds — MultiTag */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-purple-500/20 bg-purple-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-purple-500/80">HilltopAds</p>
              <p className="text-[9px] text-purple-500/40">MultiTag · 320×50</p>
              <p className="text-[9px] text-green-500/50 mt-1">$1.50-3 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $15-30/mo</p>
            </div>

            {/* === SOCIAL & PUSH === */}
            <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-widest text-center pt-1">Social & Push</p>

            {/* Adsterra — Social Bar */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-pink-500/20 bg-pink-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-pink-500/80">Adsterra</p>
              <p className="text-[9px] text-pink-500/40">Social Bar · 320×50</p>
              <p className="text-[9px] text-green-500/50 mt-1">$1.50-2.80 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $15-28/mo</p>
            </div>

            {/* PropellerAds — Push Notification */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-pink-500/20 bg-pink-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-pink-500/80">PropellerAds</p>
              <p className="text-[9px] text-pink-500/40">Push Notif · hidden</p>
              <p className="text-[9px] text-green-500/50 mt-1">$1-4 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $10-40/mo · recurring</p>
            </div>

            {/* AdMaven — Push Notification */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-pink-500/20 bg-pink-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-pink-500/80">AdMaven</p>
              <p className="text-[9px] text-pink-500/40">Push Notif · hidden</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2-6 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $20-60/mo</p>
            </div>

            {/* === POPUNDER === */}
            <p className="text-[9px] font-bold text-orange-500/40 uppercase tracking-widest text-center pt-1">Popunder</p>

            {/* PropellerAds — Popunder */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-orange-500/20 bg-orange-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-orange-500/80">PropellerAds</p>
              <p className="text-[9px] text-orange-500/40">Popunder · hidden</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2-6 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $20-60/mo · passive</p>
            </div>

            {/* PopAds — Popunder */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-orange-500/20 bg-orange-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-orange-500/80">PopAds</p>
              <p className="text-[9px] text-orange-500/40">Popunder · hidden</p>
              <p className="text-[9px] text-green-500/50 mt-1">$2-5 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">instant approve</p>
            </div>

            {/* AdMaven — Popunder + Push */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-orange-500/20 bg-orange-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-orange-500/80">AdMaven</p>
              <p className="text-[9px] text-orange-500/40">Push + Pop · hidden</p>
              <p className="text-[9px] text-green-500/50 mt-1">$3-8 eCPM</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $30-80/mo</p>
            </div>

            {/* === AFFILIATE CPA === */}
            <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-widest text-center pt-1">Affiliate CPA</p>

            {/* Binance — Affiliate */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-cyan-500/20 bg-cyan-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-cyan-500/80">Binance</p>
              <p className="text-[9px] text-cyan-500/40">Affiliate · CPA</p>
              <p className="text-[9px] text-green-500/50 mt-1">$30 CPA</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $300/mo · 10 signup</p>
            </div>

            {/* Webull — Affiliate */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-cyan-500/20 bg-cyan-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-cyan-500/80">Webull</p>
              <p className="text-[9px] text-cyan-500/40">Affiliate · CPA</p>
              <p className="text-[9px] text-green-500/50 mt-1">$100 CPA</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $1000/mo · 10 signup</p>
            </div>

            {/* Bybit — Affiliate */}
            <div className="flex-1 flex flex-col min-h-[100px] rounded-lg border border-dashed border-cyan-500/20 bg-cyan-500/5 p-2 items-center justify-center text-center">
              <p className="text-xs font-bold text-cyan-500/80">Bybit</p>
              <p className="text-[9px] text-cyan-500/40">Affiliate · CPA</p>
              <p className="text-[9px] text-green-500/50 mt-1">$25 CPA</p>
              <p className="text-[9px] text-muted-foreground/30 mt-auto pt-1">est. $250/mo · 10 signup</p>
            </div>

            {/* === TOTAL === */}
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-2 text-center">
              <p className="text-[9px] text-green-500/60 uppercase tracking-wider">Est. Total Revenue</p>
              <p className="text-sm font-bold text-green-500">$780-2,200/mo</p>
              <p className="text-[8px] text-muted-foreground/40">10K pageviews/day · all networks</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating AI Assistant */}
      <CryptoAssistant latestSignal={latestSignal ? {
        type: latestSignal.type,
        coin: latestSignal.symbol || latestSignal.coin || 'BTC',
        price: latestSignal.price || 0,
        confidence: latestSignal.confidence || 0,
        timeframe: latestSignal.timeframe || '4h',
      } : null} />

      {/* Sticky bottom ad bar — mobile only */}
      <StickyAdBar />

      {/* Popunder trigger — global passive income */}
      <AdSlot format="popunder" />
    </div>
  )
}
