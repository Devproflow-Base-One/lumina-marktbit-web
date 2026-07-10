/**
 * WebSocket Real-time Signal Streaming
 * F4d: Socket.io client + server for live signal updates
 *
 * Events:
 * - signal:new — new signal generated
 * - signal:update — existing signal updated
 * - signal:expire — signal expired/hit TP/SL
 * - market:tick — real-time price tick
 * - market:status — market open/close change
 * - alert:trigger — user alert triggered
 */

import { io, Socket } from 'socket.io-client'

// ── Types ──

export type WsEvent =
  | 'signal:new'
  | 'signal:update'
  | 'signal:expire'
  | 'market:tick'
  | 'market:status'
  | 'alert:trigger'
  | 'notification:new'

export interface WsSignalPayload {
  id: string
  symbol: string
  type: string
  category: string
  confidence: number
  price: number
  timestamp: string
}

export interface WsTickPayload {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
}

export interface WsAlertPayload {
  alertId: string
  userId: string
  symbol: string
  alertType: string
  message: string
  triggeredAt: string
}

// ── Client-side WebSocket Manager ──

class WebSocketManager {
  private socket: Socket | null = null
  private listeners: Map<WsEvent, Set<(data: unknown) => void>> = new Map()
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(url?: string): void {
    if (this.socket?.connected) return

    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    this.socket = io(wsUrl, {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    this.socket.on('connect', () => {
      this.connected = true
      this.reconnectAttempts = 0
      console.log('[WS] Connected')
    })

    this.socket.on('disconnect', () => {
      this.connected = false
      console.log('[WS] Disconnected')
    })

    this.socket.on('connect_error', (err: Error) => {
      this.reconnectAttempts++
      console.warn(`[WS] Connection error (${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, err.message)
    })

    // Register all event listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((cb) => {
        this.socket?.on(event, cb)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  on(event: WsEvent, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    this.socket?.on(event, callback)

    return () => {
      this.listeners.get(event)?.delete(callback)
      this.socket?.off(event, callback)
    }
  }

  off(event: WsEvent, callback?: (data: unknown) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback)
      this.socket?.off(event, callback)
    } else {
      this.listeners.delete(event)
      this.socket?.removeAllListeners(event)
    }
  }

  emit(event: string, data: unknown): void {
    this.socket?.emit(event, data)
  }

  isConnected(): boolean {
    return this.connected
  }

  // ── Typed helpers ──

  onSignalNew(cb: (signal: WsSignalPayload) => void): () => void {
    return this.on('signal:new', cb as (data: unknown) => void)
  }

  onSignalUpdate(cb: (signal: WsSignalPayload) => void): () => void {
    return this.on('signal:update', cb as (data: unknown) => void)
  }

  onSignalExpire(cb: (signal: WsSignalPayload) => void): () => void {
    return this.on('signal:expire', cb as (data: unknown) => void)
  }

  onMarketTick(cb: (tick: WsTickPayload) => void): () => void {
    return this.on('market:tick', cb as (data: unknown) => void)
  }

  onAlertTrigger(cb: (alert: WsAlertPayload) => void): () => void {
    return this.on('alert:trigger', cb as (data: unknown) => void)
  }

  // ── Room subscriptions ──

  subscribeToCategory(category: string): void {
    this.emit('subscribe', { room: `category:${category}` })
  }

  unsubscribeFromCategory(category: string): void {
    this.emit('unsubscribe', { room: `category:${category}` })
  }

  subscribeToSymbol(symbol: string): void {
    this.emit('subscribe', { room: `symbol:${symbol}` })
  }

  unsubscribeFromSymbol(symbol: string): void {
    this.emit('unsubscribe', { room: `symbol:${symbol}` })
  }

  subscribeToUserAlerts(userId: string): void {
    this.emit('subscribe', { room: `user:${userId}` })
  }
}

// ── Singleton ──

let wsManager: WebSocketManager | null = null

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager()
  }
  return wsManager
}

// ── React hook ──

export function useWebSocket() {
  const manager = getWebSocketManager()
  return {
    connect: () => manager.connect(),
    disconnect: () => manager.disconnect(),
    on: (event: WsEvent, cb: (data: unknown) => void) => manager.on(event, cb),
    onSignalNew: (cb: (s: WsSignalPayload) => void) => manager.onSignalNew(cb),
    onSignalUpdate: (cb: (s: WsSignalPayload) => void) => manager.onSignalUpdate(cb),
    onSignalExpire: (cb: (s: WsSignalPayload) => void) => manager.onSignalExpire(cb),
    onMarketTick: (cb: (t: WsTickPayload) => void) => manager.onMarketTick(cb),
    onAlertTrigger: (cb: (a: WsAlertPayload) => void) => manager.onAlertTrigger(cb),
    subscribeToCategory: (cat: string) => manager.subscribeToCategory(cat),
    subscribeToSymbol: (sym: string) => manager.subscribeToSymbol(sym),
    isConnected: () => manager.isConnected(),
  }
}
