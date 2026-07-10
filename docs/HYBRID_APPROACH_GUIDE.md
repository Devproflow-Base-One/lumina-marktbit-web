# Hybrid Approach: Widget + Component Architecture

## Overview
**Hybrid Approach** = Kombinasi terbaik antara **Widget Pattern** (untuk complex features) dan **Component-Based** (untuk simple UI).

Tujuan: Dapatkan **reusability** dari widgets + **flexibility** dari components.

---

## Architecture Comparison

### Current (Pure Component-Based)
```
Page
├── State Management
├── Data Fetching
├── Layout
├── Components
│   ├── Card
│   ├── Button
│   ├── Input
│   └── ...
└── Styling
```

**Karakteristik:**
- Semua logic di page
- Banyak boilerplate
- Flexible tapi repetitive

---

### Widget Pattern (Pure Widget)
```
Page
└── Widget (Self-contained)
    ├── State Management
    ├── Data Fetching
    ├── Layout
    ├── Components
    └── Styling
```

**Karakteristik:**
- Semua logic di widget
- Simple page
- Less flexible

---

### Hybrid Approach (RECOMMENDED)
```
Page
├── Layout (Sidebar, Header)
├── Widgets (Complex Features)
│   ├── LeadsWidget
│   ├── ProjectsWidget
│   └── StatsWidget
├── Components (Simple UI)
│   ├── Card
│   ├── Button
│   ├── Input
│   └── ...
└── Styling
```

**Karakteristik:**
- Complex features → Widgets
- Simple UI → Components
- Balance flexibility & reusability
- Best of both worlds

---

## What Should Be Widget vs Component?

### ✅ SHOULD BE WIDGET (Complex Features)

#### 1. **LeadsWidget**
```tsx
// widgets/LeadsWidget.tsx
export default function LeadsWidget() {
  // State
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Data Fetching
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const data = await api.getLeads()
      setLeads(data)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtering Logic
  const filteredLeads = leads.filter(lead => {
    const matchesQuery = lead.name.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesQuery && matchesStatus
  })

  // UI
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total" value={leads.length} />
        <StatsCard title="Hot" value={leads.filter(l => l.status === 'hot').length} />
        <StatsCard title="Warm" value={leads.filter(l => l.status === 'warm').length} />
        <StatsCard title="Cold" value={leads.filter(l => l.status === 'cold').length} />
      </div>

      {/* Search & Filter */}
      <SearchFilterBar query={query} onQueryChange={setQuery} />

      {/* Leads Grid */}
      {isLoading ? (
        <LeadsLoadingSkeleton />
      ) : filteredLeads.length === 0 ? (
        <EmptyLeads />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Why Widget?**
- ✅ Complex state management (leads, filters, loading)
- ✅ Data fetching logic
- ✅ Filtering & search logic
- ✅ Multiple sub-components
- ✅ Self-contained feature
- ✅ Reusable di multiple pages

**Reusable di:**
- Leads page
- Dashboard (recent leads)
- Reports page (leads analytics)

---

#### 2. **ProjectsWidget**
```tsx
// widgets/ProjectsWidget.tsx
export default function ProjectsWidget() {
  // State
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Data Fetching
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects()
      setProjects(data)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtering Logic
  const filteredProjects = projects.filter(project => {
    const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase())
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesQuery && matchesType && matchesStatus
  })

  // UI
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total" value={projects.length} />
        <StatsCard title="Active" value={projects.filter(p => p.active).length} />
        <StatsCard title="Leads" value={projects.reduce((sum, p) => sum + p.leads, 0)} />
        <StatsCard title="Units" value={projects.reduce((sum, p) => sum + p.units, 0)} />
      </div>

      {/* Search & Filter */}
      <SearchFilterBar query={query} onQueryChange={setQuery} />

      {/* Projects Grid */}
      {isLoading ? (
        <ProjectsLoadingSkeleton />
      ) : filteredProjects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Why Widget?**
- ✅ Complex state management
- ✅ Multiple filters (type, status, search)
- ✅ Data fetching
- ✅ Self-contained
- ✅ Reusable

**Reusable di:**
- Projects page
- Dashboard (recent projects)
- Portfolio page

---

#### 3. **StatsWidget**
```tsx
// widgets/StatsWidget.tsx
export default function StatsWidget() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await api.getStats()
      setStats(data)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <StatsLoadingSkeleton />

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Leads"
        value={stats.totalLeads}
        trend={stats.leadsGrowth}
        icon="users"
      />
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        trend={stats.projectsGrowth}
        icon="building"
      />
      <StatCard
        title="Revenue"
        value={formatCurrency(stats.revenue)}
        trend={stats.revenueGrowth}
        icon="dollar"
      />
      <StatCard
        title="Conversion"
        value={`${stats.conversionRate}%`}
        trend={stats.conversionGrowth}
        icon="trending"
      />
    </div>
  )
}
```

**Why Widget?**
- ✅ Data fetching
- ✅ Loading state
- ✅ Calculation logic
- ✅ Reusable

**Reusable di:**
- Dashboard
- Analytics page
- Reports

---

#### 4. **AnalyticsWidget**
```tsx
// widgets/AnalyticsWidget.tsx
export default function AnalyticsWidget() {
  const [chartData, setChartData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAnalytics(period)
      setChartData(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'quarter', 'year'].map(p => (
          <Button
            key={p}
            variant={period === p ? 'default' : 'outline'}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Chart */}
      {isLoading ? (
        <ChartLoadingSkeleton />
      ) : (
        <LineChart data={chartData} />
      )}
    </div>
  )
}
```

**Why Widget?**
- ✅ Data fetching
- ✅ Period selection logic
- ✅ Chart rendering
- ✅ Reusable

---

### ❌ SHOULD BE COMPONENT (Simple UI)

#### 1. **Card Component**
```tsx
// components/ui/card.tsx
export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-zinc-800 bg-zinc-950/90',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

**Why Component?**
- ✅ Simple UI wrapper
- ✅ No logic
- ✅ No state
- ✅ Reusable everywhere

---

#### 2. **Button Component**
```tsx
// components/ui/button.tsx
export function Button({ children, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-yellow-500 text-black hover:bg-yellow-600',
    outline: 'border border-zinc-700 text-zinc-100 hover:bg-zinc-800',
    ghost: 'text-zinc-400 hover:text-zinc-100',
  }

  return (
    <button
      className={cn('px-4 py-2 rounded-lg transition-colors', variants[variant])}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Why Component?**
- ✅ Simple styling
- ✅ No logic
- ✅ Reusable

---

#### 3. **Input Component**
```tsx
// components/ui/input.tsx
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100',
        className
      )}
      {...props}
    />
  )
}
```

**Why Component?**
- ✅ Simple form element
- ✅ No logic
- ✅ Reusable

---

#### 4. **Badge Component**
```tsx
// components/ui/badge.tsx
export function Badge({ children, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-100',
    success: 'bg-yellow-500/20 text-yellow-400',
    warning: 'bg-amber-500/20 text-amber-400',
    error: 'bg-red-500/20 text-red-400',
  }

  return (
    <span
      className={cn('px-2 py-1 rounded text-xs font-medium', variants[variant])}
      {...props}
    >
      {children}
    </span>
  )
}
```

**Why Component?**
- ✅ Simple UI element
- ✅ No logic
- ✅ Reusable

---

#### 5. **StatCard Component**
```tsx
// components/StatCard.tsx
export function StatCard({ title, value, trend, icon }) {
  const Icon = iconMap[icon]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs uppercase">{title}</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{value}</p>
            {trend && (
              <p className={cn('text-xs mt-1', trend > 0 ? 'text-yellow-400' : 'text-red-400')}>
                {trend > 0 ? '+' : ''}{trend}%
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Why Component?**
- ✅ Presentational only
- ✅ Props-driven
- ✅ No state
- ✅ Reusable

---

## Hybrid Architecture in Action

### Page Structure

```tsx
// pages/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Layout Components */}
      <TopHeader />
      <Sidebar />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6">
        {/* Widgets (Complex Features) */}
        <StatsWidget />
        <LeadsWidget />
        <ProjectsWidget />
        <AnalyticsWidget />

        {/* Components (Simple UI) */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost">View All Leads</Button>
                <Button variant="ghost">View All Projects</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Activity list */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
```

### Leads Page with Hybrid

```tsx
// pages/leads/page.tsx
export default function LeadsPage() {
  return (
    <div className="min-h-screen">
      <TopHeader />
      <Sidebar />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6">
        {/* Widget (Complex Feature) */}
        <LeadsWidget />

        {/* Components (Simple UI) */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="success">Tip</Badge>
                  <span>Focus on hot leads first</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="warning">Tip</Badge>
                  <span>Follow up within 24 hours</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
```

---

## Comparison: Current vs Hybrid

### Current (Pure Component-Based)

**Leads Page:**
```tsx
// ~300 lines of code
export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // fetch logic
  }, [])

  const filteredLeads = leads.filter(...)

  return (
    <div>
      {/* All UI here */}
    </div>
  )
}
```

**Pros:**
- ✅ Flexible
- ✅ Lightweight

**Cons:**
- ⚠️ Long file
- ⚠️ Repetitive in multiple pages

---

### Hybrid (Widgets + Components)

**Leads Page:**
```tsx
// ~20 lines of code
export default function LeadsPage() {
  return (
    <div className="min-h-screen">
      <TopHeader />
      <Sidebar />
      <main>
        <LeadsWidget />
      </main>
    </div>
  )
}
```

**Leads Widget:**
```tsx
// ~250 lines of code (encapsulated)
export default function LeadsWidget() {
  // All logic here
}
```

**Pros:**
- ✅ Clean page structure
- ✅ Reusable widget
- ✅ Encapsulated logic
- ✅ Easy to maintain

**Cons:**
- ⚠️ Extra file
- ⚠️ Less flexible

---

## Widget Candidates for Lumina Dashboard

### Priority 1 (HIGH - Create First)
| Widget | Complexity | Reusability | Priority |
|--------|-----------|------------|----------|
| **LeadsWidget** | High | High (Dashboard, Leads, Reports) | 🔴 HIGH |
| **ProjectsWidget** | High | High (Dashboard, Projects, Portfolio) | 🔴 HIGH |
| **StatsWidget** | Medium | High (Dashboard, Analytics) | 🔴 HIGH |

### Priority 2 (MEDIUM - Create Later)
| Widget | Complexity | Reusability | Priority |
|--------|-----------|------------|----------|
| **AnalyticsWidget** | High | Medium (Dashboard, Analytics) | 🟡 MEDIUM |
| **RecentActivityWidget** | Medium | Medium (Dashboard, Activity) | 🟡 MEDIUM |
| **QuickActionsWidget** | Low | Medium (Dashboard, Sidebar) | 🟡 MEDIUM |

### Priority 3 (LOW - Optional)
| Widget | Complexity | Reusability | Priority |
|--------|-----------|------------|----------|
| **NotificationsWidget** | Low | Low (Dashboard only) | 🟢 LOW |
| **CalendarWidget** | Medium | Low (Dashboard only) | 🟢 LOW |

---

## Implementation Roadmap

### Phase 1: Create Core Widgets
```
Week 1:
- [ ] LeadsWidget
- [ ] ProjectsWidget
- [ ] StatsWidget

Week 2:
- [ ] Update Dashboard to use widgets
- [ ] Update Leads page to use LeadsWidget
- [ ] Update Projects page to use ProjectsWidget
```

### Phase 2: Create Additional Widgets
```
Week 3:
- [ ] AnalyticsWidget
- [ ] RecentActivityWidget
- [ ] QuickActionsWidget

Week 4:
- [ ] Integrate into Dashboard
- [ ] Test & optimize
```

### Phase 3: Refactor Pages
```
Week 5:
- [ ] Update all pages to use widgets
- [ ] Remove duplicate code
- [ ] Optimize performance
```

---

## Summary

### What Should Be Widget?
✅ **Complex Features** with:
- Data fetching
- State management
- Business logic
- Multiple sub-components
- Reusable in multiple places

### What Should Be Component?
✅ **Simple UI** with:
- No logic
- No state
- Presentational only
- Props-driven
- Reusable everywhere

### Hybrid Benefits
✅ **Best of Both Worlds:**
- Reusability of widgets
- Flexibility of components
- Clean code structure
- Easy maintenance
- Scalable architecture

---

## Recommendation for Lumina Dashboard

**IMPLEMENT HYBRID APPROACH!** ✅

**Start with:**
1. LeadsWidget
2. ProjectsWidget
3. StatsWidget

**Keep as Components:**
- Card, Button, Input, Badge
- All UI elements
- All presentational components

**Result:**
- Clean, maintainable code
- Reusable widgets
- Flexible components
- Scalable architecture
