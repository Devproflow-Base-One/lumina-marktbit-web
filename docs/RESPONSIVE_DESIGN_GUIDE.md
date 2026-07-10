# Mobile Responsive Design Guide

## Overview
This guide documents the responsive design implementation for Lumina Dashboard. All pages follow a mobile-first approach using Tailwind CSS breakpoints.

## Tailwind Breakpoints
- **xs** (0px): Mobile phones
- **sm** (640px): Small tablets
- **md** (768px): Medium tablets
- **lg** (1024px): Laptops
- **xl** (1280px): Large screens
- **2xl** (1536px): Extra large screens

## Layout Patterns

### 1. Sidebar + Main Content Layout
```tsx
<div className="flex min-h-screen flex-col md:flex-row">
  <aside className="hidden lg:block">
    <Sidebar />
  </aside>
  <div className="flex min-w-0 flex-1 flex-col">
    <TopHeader />
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {/* Content */}
    </main>
  </div>
</div>
```

**Behavior:**
- Mobile (xs-md): Full-width content, sidebar hidden
- Tablet (md-lg): Sidebar visible on the side
- Desktop (lg+): Full layout with sidebar

### 2. Stats Cards Grid
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>
```

**Behavior:**
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 4 columns

### 3. Content Cards Grid
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

**Behavior:**
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 3 columns

### 4. Header with Actions
```tsx
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1>Title</h1>
    <p>Description</p>
  </div>
  <Button>Action</Button>
</div>
```

**Behavior:**
- Mobile: Stacked vertically
- Tablet (sm+): Horizontal layout with space-between

## Responsive Utilities

### Container Padding
```tsx
// Standard padding
className="px-4 py-6 sm:px-6 lg:px-8"

// Mobile: 16px horizontal, 24px vertical
// Tablet: 24px horizontal
// Desktop: 32px horizontal
```

### Text Sizing
```tsx
// Responsive heading
className="text-2xl sm:text-3xl md:text-4xl font-bold"

// Mobile: 24px
// Tablet: 30px
// Desktop: 36px
```

### Spacing
```tsx
// Responsive gap
className="gap-4 sm:gap-6 md:gap-8 lg:gap-12"

// Mobile: 16px
// Tablet: 24px
// Desktop: 32px-48px
```

## Common Patterns

### Mobile Menu Toggle
```tsx
<button className="lg:hidden">
  {/* Mobile menu button */}
</button>

<nav className="hidden lg:flex">
  {/* Desktop navigation */}
</nav>
```

### Responsive Table
```tsx
// On mobile: Stack as cards
// On desktop: Show as table
<div className="overflow-x-auto">
  <table className="w-full text-sm sm:text-base">
    {/* Table content */}
  </table>
</div>
```

### Responsive Forms
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <input className="w-full" />
  <input className="w-full" />
</div>
```

## Implementation Checklist

- [ ] All pages use mobile-first approach
- [ ] Sidebar hidden on mobile (hidden lg:block)
- [ ] Content padding responsive (px-4 sm:px-6 lg:px-8)
- [ ] Grids responsive (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4)
- [ ] Text sizes responsive (text-sm sm:text-base md:text-lg)
- [ ] Buttons full-width on mobile, auto on desktop
- [ ] Forms stack on mobile, side-by-side on desktop
- [ ] Images responsive (w-full max-w-...)
- [ ] Modals full-screen on mobile, centered on desktop
- [ ] Navigation responsive (hidden lg:flex)

## Pages Updated

### Leads Page
- ✅ Sidebar responsive (hidden lg:block)
- ✅ Stats cards grid (1 → 2 → 4 columns)
- ✅ Leads grid (1 → 2 → 3 columns)
- ✅ Search bar responsive
- ✅ Filter buttons responsive

### Projects Page
- ✅ Sidebar responsive (hidden lg:block)
- ✅ Stats cards grid (1 → 2 → 4 columns)
- ✅ Projects grid (1 → 2 → 3 columns)
- ✅ Search bar responsive
- ✅ Filter buttons responsive

### Dashboard Page
- ✅ Sidebar responsive (hidden lg:block)
- ✅ Stats cards grid (1 → 2 → 4 columns)
- ✅ Workspace responsive

## Testing Checklist

### Mobile (375px - 639px)
- [ ] Sidebar hidden
- [ ] Content full-width with padding
- [ ] Grids show 1 column
- [ ] Buttons full-width
- [ ] Text readable without zoom
- [ ] No horizontal scroll

### Tablet (640px - 1023px)
- [ ] Sidebar still hidden
- [ ] Grids show 2 columns
- [ ] Content properly spaced
- [ ] Touch targets adequate (44px+)

### Desktop (1024px+)
- [ ] Sidebar visible
- [ ] Grids show 3-4 columns
- [ ] Full layout utilized
- [ ] Hover states work

## Best Practices

1. **Mobile-First**: Start with mobile styles, add breakpoints for larger screens
2. **Flexible Grids**: Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern
3. **Flexible Images**: Always use `w-full` and `max-w-...`
4. **Touch-Friendly**: Buttons and links minimum 44px height
5. **Readable Text**: Use responsive font sizes
6. **Consistent Spacing**: Use Tailwind spacing scale (4px increments)
7. **Test on Real Devices**: Don't just use browser DevTools

## Responsive Utilities File

All responsive patterns are documented in `lib/responsive.ts`:

```tsx
import { responsiveClasses, responsivePatterns } from '@/lib/responsive'

// Use predefined classes
className={responsiveClasses.grid3Col}

// Or use patterns
className={responsivePatterns.layoutWithSidebar.container}
```

## Future Improvements

- [ ] Create responsive hook for detecting breakpoints
- [ ] Add responsive image component
- [ ] Create responsive table component
- [ ] Add responsive modal component
- [ ] Implement responsive navigation drawer
