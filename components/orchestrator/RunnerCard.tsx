'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkerCard {
  id: string
  workerId: string
  name: string
  description: string
  icon: React.ElementType
  status: 'running' | 'idle'
  lastScan: string
  systemLoad: number
  successRate: number
  pid?: number
  cpuPercent?: number
  memoryPercent?: number
}

interface WorkerCardProps {
  worker: WorkerCard
  loading: boolean
  onToggle: () => void
}

export function RunnerCard({ worker, loading, onToggle }: WorkerCardProps) {
  const IconComponent = worker.icon

  const getSystemLoadColor = (load: number) => {
    if (load < 50) return 'text-yellow-500'
    if (load < 75) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <Card
      className={`bg-zinc-950/50 border backdrop-blur-sm transition-all duration-300 ${
        worker.status === 'running'
          ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
          : 'border-zinc-800'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                worker.status === 'running' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100">{worker.name}</CardTitle>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">{worker.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Switch
                checked={worker.status === 'running'}
                onCheckedChange={onToggle}
                disabled={loading}
                className={worker.status === 'running' ? 'data-[state=checked]:bg-yellow-500' : ''}
                aria-label={`Toggle ${worker.name} worker`}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                </div>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                worker.status === 'running' ? 'text-yellow-500' : 'text-zinc-500'
              }`}
            >
              Status: {worker.status === 'running' ? 'Running' : 'Idle'}
            </span>
          </div>
          <div
            className={`w-2 h-2 rounded-full ${
              worker.status === 'running' ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-600'
            }`}
            aria-label={`Worker status indicator: ${worker.status}`}
          />
        </div>

        {/* System Load Bar */}
        {worker.status === 'running' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500">System Load</span>
              <span className={`text-xs font-medium ${getSystemLoadColor(worker.systemLoad)}`}>
                {worker.systemLoad}%
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5" role="progressbar" aria-valuenow={worker.systemLoad} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  worker.systemLoad < 50
                    ? 'bg-yellow-500'
                    : worker.systemLoad < 75
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${worker.systemLoad}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Rate */}
        {worker.status === 'running' && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Success Rate</span>
            <span className="text-xs font-medium text-yellow-500">{worker.successRate}%</span>
          </div>
        )}

        {/* Last Log */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-zinc-500" />
            <span className="text-xs text-zinc-400">{worker.lastScan}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
