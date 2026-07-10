'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Cpu, AlertTriangle, Zap, RefreshCw, Activity, Bell } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'

export default function SettingsPage() {
  const [signalApiUrl, setSignalApiUrl] = useState(process.env.NEXT_PUBLIC_SIGNAL_API_URL || 'http://localhost:8787/api/v1')
  const [stockApiUrl, setStockApiUrl] = useState(process.env.NEXT_PUBLIC_STOCK_API_URL || 'http://localhost:8788/api/v1')
  const [minConfidence, setMinConfidence] = useState('70')
  const [telegramEnabled, setTelegramEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.12),transparent_35%),linear-gradient(180deg,#020617_0%,#000_100%)] text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden xl:block">
          <Sidebar />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card className="border-zinc-800 bg-zinc-950/90">
                <CardHeader>
                  <CardDescription className="flex items-center gap-2 text-zinc-400">
                    <Cpu className="h-5 w-5 text-yellow-400" />
                    Engine configuration
                  </CardDescription>
                  <CardTitle className="text-3xl text-zinc-100">Signal Engine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-zinc-800 bg-black/35 p-4">
                    <div className="mb-2 text-base text-zinc-300">Signal API URL</div>
                    <Input
                      value={signalApiUrl}
                      onChange={e => setSignalApiUrl(e.target.value)}
                      className="border-zinc-700 bg-zinc-900 text-zinc-100"
                    />
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black/35 p-4">
                    <div className="mb-2 text-base text-zinc-300">Stock API URL</div>
                    <Input
                      value={stockApiUrl}
                      onChange={e => setStockApiUrl(e.target.value)}
                      className="border-zinc-700 bg-zinc-900 text-zinc-100"
                    />
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black/35 p-4">
                    <div className="mb-2 text-base text-zinc-300">Minimum Confidence Threshold (%)</div>
                    <Input
                      type="number"
                      value={minConfidence}
                      onChange={e => setMinConfidence(e.target.value)}
                      className="border-zinc-700 bg-zinc-900 text-zinc-100"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-zinc-800 bg-zinc-950/90">
                  <CardHeader>
                    <CardDescription className="flex items-center gap-2 text-zinc-400">
                      <Bell className="h-5 w-5 text-yellow-400" />
                      Notifications
                    </CardDescription>
                    <CardTitle className="text-2xl text-zinc-100">Alert Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/35 p-4">
                      <div>
                        <div className="text-base text-zinc-300">Telegram alerts</div>
                        <div className="text-sm text-zinc-500 mt-1">Receive signal notifications via Telegram</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={telegramEnabled ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-zinc-700 bg-zinc-900 text-zinc-400'}
                        onClick={() => setTelegramEnabled(!telegramEnabled)}
                      >
                        {telegramEnabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/35 p-4">
                      <div>
                        <div className="text-base text-zinc-300">Email alerts</div>
                        <div className="text-sm text-zinc-500 mt-1">Daily signal digest via email</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={emailAlerts ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-zinc-700 bg-zinc-900 text-zinc-400'}
                        onClick={() => setEmailAlerts(!emailAlerts)}
                      >
                        {emailAlerts ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-zinc-950/90">
                  <CardHeader>
                    <CardDescription className="flex items-center gap-2 text-zinc-400">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Danger zone
                    </CardDescription>
                    <CardTitle className="text-2xl text-zinc-100">System actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10"
                      aria-label="Restart signal engine"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Restart signal engine
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10"
                      aria-label="Clear all signal history"
                    >
                      <Activity className="mr-2 h-5 w-5" />
                      Clear signal history
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-950/90">
                  <CardHeader>
                    <CardDescription className="text-zinc-400">Deploy</CardDescription>
                    <CardTitle className="text-2xl text-zinc-100">Apply configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400" aria-label="Apply new MarktBit configuration">
                      <Zap className="mr-2 h-5 w-5" />
                      Apply config
                    </Button>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-yellow-500/15 text-yellow-300">Engine running</Badge>
                      <Badge className="bg-green-500/15 text-green-300">Crypto active</Badge>
                      <Badge className="bg-blue-500/15 text-blue-300">Stocks active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
          {/* Native ad at bottom of settings */}
          <div className="mt-6">
            <AdSlot size="native" format="native" />
          </div>
        </div>
      </div>
    </div>
  )
}
