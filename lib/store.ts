import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface WorkerCard {
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

export interface SystemMetrics {
  systemLoad: number
  activeWorkers: number
  totalWorkers: number
  apiRateLimit: 'Normal' | 'Warning' | 'Critical'
}

export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'USER' | 'OPERATOR' | 'VIEWER'
  isActive: boolean
  permissions: string[]
}

export interface AppState {
  // System state
  workers: WorkerCard[]
  systemMetrics: SystemMetrics
  loadingStates: Record<string, boolean>
  apiError: string | null
  lastSync: Date

  // UI state
  sidebarOpen: boolean
  notificationsOpen: boolean

  // User state
  user: User | null
  isAuthenticated: boolean

  // Actions
  setWorkers: (workers: WorkerCard[]) => void
  updateWorker: (id: string, updates: Partial<WorkerCard>) => void
  setSystemMetrics: (metrics: SystemMetrics) => void
  setLoadingState: (id: string, loading: boolean) => void
  setApiError: (error: string | null) => void
  setLastSync: (date: Date) => void
  setSidebarOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void

  // User actions
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void

  // Computed
  getActiveWorkers: () => WorkerCard[]
  getWorkerById: (id: string) => WorkerCard | undefined
  isWorkerLoading: (id: string) => boolean
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      workers: [] as WorkerCard[],
      systemMetrics: {
        systemLoad: 45,
        activeWorkers: 0,
        totalWorkers: 6,
        apiRateLimit: 'Normal',
      },
      loadingStates: {} as Record<string, boolean>,
      apiError: null as string | null,
      lastSync: new Date(),
      sidebarOpen: true,
      notificationsOpen: false,

      // User state
      user: null as User | null,
      isAuthenticated: false,

      // Actions
      setWorkers: workers => set({ workers }),

      updateWorker: (id, updates) =>
        set(state => ({
          workers: state.workers.map(worker =>
            worker.id === id ? { ...worker, ...updates } : worker
          ),
        })),

      setSystemMetrics: metrics => set({ systemMetrics: metrics }),

      setLoadingState: (id, loading) =>
        set(state => ({
          loadingStates: { ...state.loadingStates, [id]: loading },
        })),

      setApiError: error => set({ apiError: error }),

      setLastSync: date => set({ lastSync: date }),

      setSidebarOpen: open => set({ sidebarOpen: open }),

      setNotificationsOpen: open => set({ notificationsOpen: open }),

      // User actions
      setUser: user => set({ user }),
      setAuthenticated: authenticated => set({ isAuthenticated: authenticated }),

      // Computed getters
      getActiveWorkers: () => get().workers.filter(worker => worker.status === 'running'),

      getWorkerById: id => get().workers.find(worker => worker.id === id),

      isWorkerLoading: id => get().loadingStates[id] || false,
    }),
    {
      name: 'lumina-overmind-store',
    }
  )
)

// Selectors for optimized re-renders
export const useWorkers = () => useAppStore(state => state.workers)
export const useSystemMetrics = () => useAppStore(state => state.systemMetrics)
export const useApiError = () => useAppStore(state => state.apiError)
export const useLoadingStates = () => useAppStore(state => state.loadingStates)
export const useSidebarOpen = () => useAppStore(state => state.sidebarOpen)
export const useNotificationsOpen = () => useAppStore(state => state.notificationsOpen)

// User selectors
export const useUser = () => useAppStore(state => state.user)
export const useIsAuthenticated = () => useAppStore(state => state.isAuthenticated)
export const useUserRole = () => useAppStore(state => state.user?.role)
export const useIsAdmin = () => useAppStore(state => state.user?.role === 'ADMIN')
