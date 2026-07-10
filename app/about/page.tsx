import { AdSlot } from '@/components/AdSlot'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-5xl font-bold text-foreground">About MarktBit</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Hybrid signal dashboard for Crypto + Saham Indonesia + Global Stocks.
        </p>
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>
            MarktBit is a <strong>monitoring &amp; education platform</strong> that provides real-time trading signals
            across three categories: cryptocurrency, Indonesian stock market (IDX), and global stock markets
            (US, Europe, Asia).
          </p>
          <p>
            Our signal engine combines technical indicators (RSI, MACD, MA, Bollinger, Stochastic, ATR)
            with AI-enhanced market analysis to deliver actionable trading signals.
          </p>
          <p>
            <strong>MarktBit is NOT a trading platform.</strong> There is no wallet, no exchange integration,
            no order placement, and no auto-trading. Trading is done on your own exchange (Binance, Ajaib, etc).
            Subscription is only for accessing signals &amp; premium features.
          </p>
          <p>
            Free tier available. Premium at $3/month. Lifetime at $99 one-time. Cancel anytime.
          </p>
        </div>

        {/* Native ad */}
        <div className="mt-12">
          <AdSlot size="native" format="native" />
        </div>
      </main>
    </div>
  )
}
