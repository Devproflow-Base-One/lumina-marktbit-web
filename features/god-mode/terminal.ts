/**
 * God Mode — Terminal Command Engine
 * F4e: Real-time terminal log streaming, command execution, history
 */

export interface TerminalLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success' | 'debug'
  source: string
  message: string
  data?: Record<string, unknown>
}

export interface CommandEntry {
  id: string
  command: string
  args: string[]
  status: 'queued' | 'running' | 'completed' | 'failed'
  output: string
  startedAt: string
  completedAt?: string
  durationMs?: number
}

export type GodModeStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'error'

export interface GodModeState {
  status: GodModeStatus
  uptime: string
  activeModules: string[]
  cpuUsage: number
  memoryUsage: number
  lastCommand: string | null
  totalCommands: number
  successRate: number
}

// ── God Mode API Client ──

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const godModeAPI = {
  async getStatus(): Promise<GodModeState> {
    const res = await fetch(`${API_BASE}/api/god-mode/status`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to get God Mode status')
    const data = await res.json()
    return data.status || data
  },

  async start(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/api/god-mode/start`, { method: 'POST' })
    if (!res.ok) throw new Error('Failed to start God Mode')
    return res.json()
  },

  async stop(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/api/god-mode/stop`, { method: 'POST' })
    if (!res.ok) throw new Error('Failed to stop God Mode')
    return res.json()
  },

  async executeCommand(command: string, args: string[] = []): Promise<CommandEntry> {
    const res = await fetch(`${API_BASE}/api/god-mode/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, args }),
    })
    if (!res.ok) throw new Error('Command execution failed')
    return res.json()
  },

  async getLogs(limit = 100, level?: string): Promise<{ logs: TerminalLog[] }> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (level) params.append('level', level)
    const res = await fetch(`${API_BASE}/api/god-mode/logs?${params}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch logs')
    return res.json()
  },

  async getAnalytics(): Promise<Record<string, unknown>> {
    const res = await fetch(`${API_BASE}/api/god-mode/analytics`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch analytics')
    return res.json()
  },
}
