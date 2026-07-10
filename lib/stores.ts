/**
 * State Management — Zustand Stores
 * F4j: Centralized state for signals, portfolio, watchlist, alerts, user, UI
 *
 * Replaces scattered React Context + prop drilling with lightweight Zustand stores.
 * Each store is independent and can be composed.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ── Types ──

import type { CoinCategory } from './coin-categories'
import type { SignalType, RiskLevel } from './crypto-signal-engine'
import type { SubscriptionTier } from './payments'
import type { Locale } from './i18n-config'

// ── Signal Store ──

interface SignalState {
  signals: Array<{
    id: string
    symbol: string
    name: string
    category: CoinCategory
    type: SignalType
    confidence: number
    price: number
    riskLevel: RiskLevel
    timestamp: string
  }>
  activeCategory: CoinCategory | 'all'
  isLoading: boolean
  lastUpdated: string | null
  setSignals: (signals: SignalState['signals']) => void
  addSignal: (signal: SignalState['signals'][0]) => void
  setActiveCategory: (category: CoinCategory | 'all') => void
  setLoading: (loading: boolean) => void
  clearSignals: () => void
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  activeCategory: 'all',
  isLoading: false,
  lastUpdated: null,
  setSignals: (signals) => set({ signals, lastUpdated: new Date().toISOString() }),
  addSignal: (signal) => set((state) => ({ signals: [signal, ...state.signals].slice(0, 100) })),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setLoading: (isLoading) => set({ isLoading }),
  clearSignals: () => set({ signals: [], lastUpdated: null }),
}))

// ── Portfolio Store ──

interface PortfolioHolding {
  id: string
  symbol: string
  name: string
  type: 'crypto' | 'stock'
  quantity: number
  avgBuyPrice: number
  currentPrice: number
  totalValue: number
  pnl: number
  pnlPercent: number
  addedAt: string
}

interface PortfolioState {
  holdings: PortfolioHolding[]
  totalValue: number
  totalPnl: number
  totalPnlPercent: number
  addHolding: (holding: Omit<PortfolioHolding, 'id' | 'addedAt' | 'totalValue' | 'pnl' | 'pnlPercent'>) => void
  removeHolding: (id: string) => void
  updatePrice: (symbol: string, currentPrice: number) => void
  clearPortfolio: () => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: [],
  totalValue: 0,
  totalPnl: 0,
  totalPnlPercent: 0,
  addHolding: (holding) =>
    set((state) => {
      const newHolding: PortfolioHolding = {
        ...holding,
        id: `${holding.symbol}-${Date.now()}`,
        addedAt: new Date().toISOString(),
        totalValue: holding.quantity * holding.currentPrice,
        pnl: (holding.currentPrice - holding.avgBuyPrice) * holding.quantity,
        pnlPercent: ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100,
      }
      const holdings = [...state.holdings, newHolding]
      return {
        holdings,
        totalValue: holdings.reduce((sum, h) => sum + h.totalValue, 0),
        totalPnl: holdings.reduce((sum, h) => sum + h.pnl, 0),
        totalPnlPercent: holdings.length > 0
          ? (holdings.reduce((sum, h) => sum + h.pnl, 0) / holdings.reduce((sum, h) => sum + h.totalValue, 0)) * 100
          : 0,
      }
    }),
  removeHolding: (id) =>
    set((state) => {
      const holdings = state.holdings.filter((h) => h.id !== id)
      return {
        holdings,
        totalValue: holdings.reduce((sum, h) => sum + h.totalValue, 0),
        totalPnl: holdings.reduce((sum, h) => sum + h.pnl, 0),
        totalPnlPercent: holdings.length > 0
          ? (holdings.reduce((sum, h) => sum + h.pnl, 0) / holdings.reduce((sum, h) => sum + h.totalValue, 0)) * 100
          : 0,
      }
    }),
  updatePrice: (symbol, currentPrice) =>
    set((state) => {
      const holdings = state.holdings.map((h) =>
        h.symbol === symbol
          ? {
              ...h,
              currentPrice,
              totalValue: h.quantity * currentPrice,
              pnl: (currentPrice - h.avgBuyPrice) * h.quantity,
              pnlPercent: ((currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100,
            }
          : h
      )
      return {
        holdings,
        totalValue: holdings.reduce((sum, h) => sum + h.totalValue, 0),
        totalPnl: holdings.reduce((sum, h) => sum + h.pnl, 0),
        totalPnlPercent: holdings.length > 0
          ? (holdings.reduce((sum, h) => sum + h.pnl, 0) / holdings.reduce((sum, h) => sum + h.totalValue, 0)) * 100
          : 0,
      }
    }),
  clearPortfolio: () => set({ holdings: [], totalValue: 0, totalPnl: 0, totalPnlPercent: 0 }),
}))

// ── Watchlist Store (persisted) ──

interface WatchlistItem {
  symbol: string
  name: string
  type: 'crypto' | 'stock'
  category?: CoinCategory
  addedAt: string
}

interface WatchlistState {
  items: WatchlistItem[]
  addToWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => void
  removeFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean
  clearWatchlist: () => void
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWatchlist: (item) =>
        set((state) => {
          if (state.items.some((i) => i.symbol === item.symbol)) return state
          return { items: [...state.items, { ...item, addedAt: new Date().toISOString() }] }
        }),
      removeFromWatchlist: (symbol) => set((state) => ({ items: state.items.filter((i) => i.symbol !== symbol) })),
      isInWatchlist: (symbol) => get().items.some((i) => i.symbol === symbol),
      clearWatchlist: () => set({ items: [] }),
    }),
    { name: 'marktbit_watchlist', storage: createJSONStorage(() => localStorage) }
  )
)

// ── Alerts Store (persisted) ──

interface AlertItem {
  id: string
  symbol: string
  name: string
  type: 'price_above' | 'price_below' | 'change_above' | 'change_below' | 'signal_new'
  threshold: number
  active: boolean
  triggered: boolean
  createdAt: string
  triggeredAt?: string
}

interface AlertState {
  alerts: AlertItem[]
  addAlert: (alert: Omit<AlertItem, 'id' | 'createdAt' | 'triggered' | 'active'>) => void
  removeAlert: (id: string) => void
  toggleAlert: (id: string) => void
  triggerAlert: (id: string) => void
  clearTriggered: () => void
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            { ...alert, id: `alert-${Date.now()}`, createdAt: new Date().toISOString(), triggered: false, active: true },
          ],
        })),
      removeAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
      toggleAlert: (id) => set((state) => ({ alerts: state.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)) })),
      triggerAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, triggered: true, triggeredAt: new Date().toISOString() } : a)),
        })),
      clearTriggered: () => set((state) => ({ alerts: state.alerts.filter((a) => !a.triggered) })),
    }),
    { name: 'marktbit_alerts', storage: createJSONStorage(() => localStorage) }
  )
)

// ── User Store (persisted) ──

interface UserState {
  user: { id: string; email: string; name?: string; tier: SubscriptionTier } | null
  isAuthenticated: boolean
  locale: Locale
  theme: 'dark' | 'light'
  setUser: (user: UserState['user']) => void
  setTier: (tier: SubscriptionTier) => void
  setLocale: (locale: Locale) => void
  setTheme: (theme: 'dark' | 'light') => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      locale: 'en',
      theme: 'dark',
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTier: (tier) => set((state) => ({ user: state.user ? { ...state.user, tier } : null })),
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'marktbit_user', storage: createJSONStorage(() => localStorage) }
  )
)

// ── UI Store ──

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  activeTab: string
  toggleSidebar: () => void
  toggleCommandPalette: () => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  activeTab: 'signals',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setActiveTab: (activeTab) => set({ activeTab }),
}))
