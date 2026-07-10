'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Activity, Zap } from 'lucide-react'

interface SystemMetrics {
  systemLoad: number
  activeWorkers: number
  totalWorkers: number
  apiRateLimit: string
}

interface SystemMetricsSectionProps {
  systemMetrics: SystemMetrics
}

export function SystemMetricsSection({ systemMetrics }: SystemMetricsSectionProps) {
  const getRateLimitColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'text-yellow-500'
      case 'Warning':
        return 'text-amber-500'
      case 'Critical':
        return 'text-red-500'
      default:
        return 'text-zinc-500'
    }
  }

  const getSystemLoadColor = (load: number) => {
    if (load < 50) return 'text-yellow-500'
    if (load < 75) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* System Load Card */}
      <Card className="bg-zinc-950/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">System Load</CardTitle>
          <Cpu className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={getSystemLoadColor(systemMetrics.systemLoad)}>{systemMetrics.systemLoad}%</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">CPU & Memory Usage</p>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-2" role="progressbar" aria-valuenow={systemMetrics.systemLoad} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                systemMetrics.systemLoad < 50
                  ? 'bg-yellow-500'
                  : systemMetrics.systemLoad < 75
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${systemMetrics.systemLoad}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Workers Card */}
      <Card className="bg-zinc-950/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Active Workers</CardTitle>
          <Activity className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">
            {systemMetrics.activeWorkers}/{systemMetrics.totalWorkers}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Signal Workers Online</p>
          <div className="mt-2 flex gap-1" role="group" aria-label="Worker status indicators">
            {Array.from({ length: systemMetrics.totalWorkers }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < systemMetrics.activeWorkers ? 'bg-yellow-500' : 'bg-zinc-700'
                }`}
                aria-label={`Worker ${i + 1} ${i < systemMetrics.activeWorkers ? 'active' : 'inactive'}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Rate Limit Card */}
      <Card className="bg-zinc-950/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">API Rate Limit</CardTitle>
          <Zap className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRateLimitColor(systemMetrics.apiRateLimit)}`}>
            {systemMetrics.apiRateLimit}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Exchange & Market API Status</p>
          <Badge
            variant="outline"
            className={`mt-2 ${
              systemMetrics.apiRateLimit === 'Normal'
                ? 'border-yellow-500 text-yellow-500'
                : systemMetrics.apiRateLimit === 'Warning'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-red-500 text-red-500'
            }`}
          >
            {systemMetrics.apiRateLimit}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
