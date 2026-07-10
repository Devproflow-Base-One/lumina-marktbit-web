import { AdSlot } from '@/components/AdSlot'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-5xl font-bold text-foreground">Terms of Service</h1>
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>By using MarktBit, you agree to the following terms:</p>
          <p>1. MarktBit provides trading signals for informational purposes only and does not constitute financial advice.</p>
          <p>2. Trading involves risk. You are responsible for your own trading decisions.</p>
          <p>3. Free tier is ad-supported. Premium tier removes ads for $3/month.</p>
          <p>4. First 5,000 users receive lifetime ad-free access.</p>
          <p>5. We reserve the right to modify or discontinue any feature at any time.</p>
        </div>

        {/* Inline ad */}
        <div className="mt-12">
          <AdSlot size="inline" />
        </div>
      </main>
    </div>
  )
}
