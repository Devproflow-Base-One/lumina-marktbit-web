import { AdSlot } from '@/components/AdSlot'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-5xl font-bold text-foreground">Contact</h1>
        <p className="text-xl text-muted-foreground mt-4">Get in touch with the MarktBit team.</p>
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Email</h2>
            <p className="text-muted-foreground">support@marktbit.app</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Telegram</h2>
            <p className="text-muted-foreground">@marktbit_support</p>
          </div>
        </div>

        {/* Inline ad */}
        <div className="mt-12">
          <AdSlot size="inline" />
        </div>
      </main>
    </div>
  )
}
