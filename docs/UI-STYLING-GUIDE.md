# MarktBit UI Styling Guide

> **Last updated:** Jun 25, 2026  
> **Status:** Active — follow this pattern for all new and existing UI elements

---

## 1. Color System

### CSS Variables (Dark Mode — default)

| Variable | HSL Value | Hex Equivalent | Usage |
|---|---|---|---|
| `--background` | `0 0% 0%` | `#000000` | Page background |
| `--foreground` | `240 10% 98%` | `#fafafa` | Primary text |
| `--card` | `240 10% 3.9%` | `#0a0a0a` | Card backgrounds |
| `--card-foreground` | `240 10% 98%` | `#fafafa` | Card text |
| `--popover` | `240 10% 3.9%` | `#0a0a0a` | Popover background |
| `--primary` | `47 95% 53%` | `#eab308` | Yellow (Crypto Gold) |
| `--primary-foreground` | `0 0% 0%` | `#000000` | Text on primary |
| `--secondary` | `240 3.7% 15.9%` | `#27272a` | Secondary surfaces |
| `--muted` | `240 3.7% 15.9%` | `#27272a` | Muted backgrounds |
| `--muted-foreground` | `240 5% 64.9%` | `#a1a1aa` | Muted text |
| `--accent` | `240 3.7% 15.9%` | `#27272a` | Accent backgrounds |
| `--accent-foreground` | `240 5% 96%` | `#f4f4f5` | Accent text |
| `--destructive` | `0 62.8% 30.6%` | `#7f1d1d` | Error/destructive |
| `--border` | `240 3.7% 15.9%` | `#27272a` | Borders |
| `--input` | `240 3.7% 15.9%` | `#27272a` | Input backgrounds |
| `--ring` | `47 95% 53%` | `#eab308` | Focus rings |
| `--radius` | `0.5rem` | — | Border radius |

### Primary Color Scale (Yellow — Crypto Gold)

| Shade | Hex |
|---|---|
| 50 | `#fefce8` |
| 100 | `#fef9c3` |
| 200 | `#fef08a` |
| 300 | `#fde047` |
| 400 | `#facc15` |
| 500 | `#eab308` |
| 600 | `#ca8a04` |
| 700 | `#a16207` |
| 800 | `#854d0e` |
| 900 | `#713f12` |
| 950 | `#422006` |

### Semantic Colors

| Type | Hex |
|---|---|
| Success | `#22c55e` (green-500) |
| Warning | `#f59e0b` (amber-500) |
| Error | `#ef4444` (red-500) |
| Info | `#3b82f6` (blue-500) |

---

## 2. Typography

### Font Families

| Family | Usage | Stack |
|---|---|---|
| `font-sans` | Body, buttons, general text | `Inter, sans-serif` |
| `font-mono` | Headings, labels, badges, nav items, code | `JetBrains Mono, monospace` |

### Global CSS Rules

```css
html { font-size: 67% !important; }
body { font-family: var(--font-sans); }
h1-h6 { font-family: var(--font-mono); font-bold; tracking-widest; uppercase; }
label { font-family: var(--font-mono); uppercase; tracking-wider; }
button { font-family: var(--font-sans); }
button[type="submit"] { font-family: var(--font-mono); tracking-wider; }
```

### Font Size Scale (Tailwind Classes)

| Element Type | Class | Size |
|---|---|---|
| Page title (h1) | `text-5xl` | 48px |
| Page description | `text-xl` | 20px |
| Card title (large) | `text-3xl` | 30px |
| Card title (standard) | `text-2xl` | 24px |
| Chart/section title | `text-xl` | 20px |
| Card description | `text-sm` | 14px |
| Filter buttons | `text-lg` | 18px |
| Table text | `text-lg` | 18px |
| Table headers | `text-base` | 16px |
| Metric labels | `text-base` | 16px |
| Metric values | `text-4xl` | 36px |
| Form labels | `text-base` | 16px |
| Badges | `text-sm` / `text-base` | 14px / 16px |
| Body text | `text-base` | 16px |
| Small hints | `text-sm` | 14px |
| Empty state main | `text-lg` | 18px |
| Empty state sub | `text-base` | 16px |
| Error message | `text-base` | 16px |
| Error hint | `text-sm` | 14px |

---

## 3. Sidebar

### Layout

| Property | Value |
|---|---|
| Width (expanded) | `w-72` (288px) |
| Width (collapsed) | `w-16` (64px) |
| Background | `bg-card` |
| Border | `border-r border-border` |
| Position | `fixed lg:relative z-50` |
| Base font size | `18px` (inline style) |

### Header (Logo)

| Element | Class | Size |
|---|---|---|
| Logo container | `w-12 h-12` | 48×48px |
| Logo background | `bg-gradient-to-br from-yellow-400 to-yellow-600` | — |
| Logo border radius | `rounded-lg` | 0.5rem |
| Logo icon (Zap) | `h-8 w-8 text-black` | 32×32px |
| Logo text | `text-3xl font-bold font-mono uppercase tracking-wider` | 30px |
| Header padding | `px-4 py-3` (inline `paddingBottom: 30px`) | — |
| Header border | `border-b border-border` | — |

### Navigation Items

| Property | Value |
|---|---|
| Font | `text-lg font-mono tracking-wider uppercase` |
| Padding | `px-4 py-3` |
| Border radius | `rounded-lg` |
| Icon size | `h-7 w-7` |
| Gap (icon-text) | `gap-3` |
| Active state | `bg-accent text-yellow-500 border-l-2 border-yellow-500` |
| Hover | `hover:bg-accent hover:text-yellow-500 hover:scale-[1.02]` |
| Active | `active:scale-[0.98]` |
| Text color (inactive) | `text-muted-foreground` |
| Badge | `px-2 py-0.5 text-xs rounded-full font-medium` |
| Badge LIVE | `bg-red-500/20 text-red-400 border border-red-500/30` |
| Badge other | `bg-yellow-500/20 text-yellow-400 border border-yellow-500/30` |

### Sub-items (Collapsible)

| Property | Value |
|---|---|
| Font | `text-lg uppercase` |
| Padding | `px-4 py-3` |
| Icon size | `h-7 w-7` (same as parent) |
| Spacing between sub-items | `space-y-5` |
| Top margin from parent | `mt-5` |
| Indentation | None (aligned with parent) |
| Collapsible container | `pt-3` (extra gap for Market Discovery from Analytics) |

### Navigation Spacing

| Property | Value |
|---|---|
| Nav container padding | `p-4` (inline `paddingTop: 20px`) |
| Spacing between items | `space-y-5` (20px) |
| Chevron icon | `h-4 w-4` |

### Footer

| Property | Value |
|---|---|
| Padding | `p-4` (inline `paddingTop: 20px`) |
| Border | `border-t border-border` |
| Language switcher spacing | `space-y-4` |
| Status text | `text-xs text-muted-foreground` |
| Status dot | `w-2 h-2 bg-yellow-500 rounded-full animate-pulse` |
| Version text | `text-xs text-muted-foreground/60` |

---

## 4. Dashboard Workspace (Main Content)

### Hero Section

| Element | Class |
|---|---|
| Hero card | `border-yellow-500/15 bg-card/90 shadow-[0_0_30px_rgba(234,179,8,0.06)]` |
| Hero card padding | `p-6 sm:p-8` |
| Badge text | `text-xl uppercase tracking-[0.22em] text-muted-foreground` |
| Badge icon (Sparkles) | `h-8 w-8 text-yellow-400` |
| Hero title | `text-4xl sm:text-5xl font-semibold font-mono uppercase` |
| Hero description | `text-base leading-7 text-muted-foreground` |

### Search Box

| Element | Class |
|---|---|
| Container | `flex min-w-[240px] flex-1 items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3` |
| Search icon | `h-7 w-7 text-muted-foreground` |
| Input | `h-10 border-0 bg-transparent p-0 text-3xl text-foreground` |
| Placeholder | `placeholder:text-muted-foreground/60 focus-visible:ring-0` |

### Action Buttons

| Button | Class |
|---|---|
| View Signals | `h-16 bg-yellow-500 px-7 text-xl font-semibold text-black hover:bg-yellow-400` |
| Backtest | `h-16 border-border bg-card/70 px-7 text-xl text-foreground hover:bg-accent` |

### Metric Cards

| Element | Class |
|---|---|
| Grid | `grid gap-3 sm:grid-cols-2 lg:grid-cols-4` |

### Module Cards (Dashboard sections)

| Element | Class |
|---|---|
| Module link | `flex items-center justify-between rounded-xl border border-border bg-background/35 px-5 py-4` |
| Module hover | `hover:border-yellow-500/30 hover:bg-accent/70` |
| Module icon container | `rounded-lg border border-border bg-muted p-2.5` |
| Module icon | `h-5 w-5 text-yellow-400` |
| Module title | `text-base font-medium text-foreground` |
| Module description | `text-sm text-muted-foreground` |
| Module badge | `px-3 py-1.5 text-sm uppercase tracking-[0.18em] text-yellow-300` |
| Module badge bg | `rounded-full border border-yellow-500/20 bg-yellow-500/5` |

### Latest Signals Card

| Element | Class |
|---|---|
| Signal row | `flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3` |
| Signal coin | `text-sm font-medium text-foreground` |
| Signal badge | `text-xs` with BUY/SELL color |
| Signal confidence | `text-xs text-muted-foreground` |
| Signal price/time | `text-xs text-muted-foreground` |

### Engine Status Box

| Element | Class |
|---|---|
| Container | `rounded-xl border border-yellow-500/15 bg-yellow-500/5 p-4` |
| Label | `text-xs uppercase tracking-[0.2em] text-yellow-300` |
| Status text | `text-lg font-semibold text-foreground` |
| Sub-status | `text-xs text-muted-foreground` |
| Status badge | `rounded-full border border-yellow-400/30 px-3 py-1 text-xs text-yellow-300` |

---

## 5. Shared Components

### Disclaimer

| Property | Value |
|---|---|
| Container | `rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-5 mb-6` |
| Icon (AlertTriangle) | `h-6 w-6 text-yellow-500` |
| Text container | `text-base` |
| Title | `text-lg font-medium text-yellow-500` |
| Body text | `text-muted-foreground` (inherits `text-base`) |

### StreakBadge

| Property | Value |
|---|---|
| Container | `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border` |
| Flame icon | `h-5 w-5` |
| Trophy icon | `h-4 w-4 text-yellow-500` |
| Month streak | `bg-yellow-500/20 text-yellow-400 border-yellow-500/40` |
| Week streak | `bg-yellow-500/15 text-yellow-400 border-yellow-500/30` |
| Default | `bg-muted text-muted-foreground border-border` |
| Priority text | `text-sm text-yellow-500/70` |

### AdSlot — Affiliate Banner

| Property | Value |
|---|---|
| Container | `rounded-lg border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 px-5 py-4` |
| Hover | `hover:border-yellow-500/40 hover:from-yellow-500/15` |
| Logo box | `w-14 h-14 rounded-lg font-bold text-base` |
| Title | `text-lg font-medium text-foreground` |
| Description | `text-base text-muted-foreground` |
| CTA text | `text-base text-yellow-500 font-medium` |
| CTA icon (ExternalLink) | `h-5 w-5 text-yellow-500` |

### AdSlot — Display Ads

| Property | Value |
|---|---|
| Label | `text-sm text-yellow-500/60 uppercase tracking-wider` |
| Ad space text | `text-base text-muted-foreground` |
| Network names | `text-yellow-500/80` |
| Subdomain text | `text-sm text-muted-foreground/50` |
| Subdomain value | `text-yellow-500/40` |
| Dismiss icon (X) | `h-3 w-3` |

### AffiliateCTA

| Property | Value |
|---|---|
| Container | `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium` |
| Background | `bg-yellow-500/10 text-yellow-500 border border-yellow-500/20` |
| Hover | `hover:bg-yellow-500/20` |
| TrendingUp icon | `h-4 w-4` |
| ExternalLink icon | `h-4 w-4` |

---

## 6. Page-Specific Patterns

### Signals Page (`/dashboard/signals`)

| Element | Class |
|---|---|
| Title | `text-5xl font-bold` |
| Description | `text-xl text-muted-foreground` |
| Live badge icon | `h-4 w-4` |
| Filter buttons | `text-lg font-mono uppercase tracking-wider` |
| Preferences button | `text-lg font-mono uppercase tracking-wider text-muted-foreground` |
| Filter icon | `h-4 w-4` |
| Preferences title | `text-2xl font-mono uppercase tracking-wider` |
| Preferences description | `text-lg text-muted-foreground` |
| Preference buttons | `text-lg font-mono uppercase tracking-wider` |
| Preference labels | `text-lg text-muted-foreground font-mono uppercase tracking-wider` |
| Preference values | `text-xl font-semibold text-foreground` |
| Recent Signals title | `text-3xl` |
| Table | `text-lg` |
| Table headers | `text-lg uppercase tracking-wider` |
| Table coin | `text-xl font-medium` |
| Table badges | `text-lg` |
| Table status badge | `text-lg` |
| Table muted text | `text-lg` |
| Signal icons (BUY/SELL/NEUTRAL) | `h-5 w-5` |
| Alert icon | `h-4 w-4` |
| Empty state icon | `h-14 w-14` |
| Empty state main text | `text-lg` |
| Empty state sub text | `text-base` |
| Error text | `text-base text-red-500` |
| Error hint | `text-sm text-muted-foreground` |

### Performance Page (`/dashboard/performance`)

| Element | Class |
|---|---|
| Title | `text-5xl font-bold` |
| Description | `text-xl text-muted-foreground` |
| Metric labels | `text-base text-muted-foreground` |
| Metric values | `text-4xl font-bold` |
| Metric icons | `h-5 w-5` |
| Chart titles | `text-xl font-semibold` |
| Engine status text | `text-base` |
| Error text | `text-base text-red-500` |
| Error hint | `text-sm text-muted-foreground` |

### Backtest Page (`/dashboard/backtest`)

| Element | Class |
|---|---|
| Title | `text-5xl font-bold` |
| Description | `text-xl text-muted-foreground` |
| Form labels | `text-base text-muted-foreground` |
| Select dropdowns | `text-base` |
| Run button | `text-base` |
| Metric labels | `text-base text-muted-foreground` |
| Metric values | `text-4xl font-bold` |
| Metric icons | `h-5 w-5` |
| Chart titles | `text-xl font-semibold` |
| Trade history title | `text-xl font-semibold` |
| Table | `text-lg` |
| Table headers | `text-base uppercase tracking-wider` |
| Table row number | `text-base text-muted-foreground` |
| Table dates | `text-sm text-muted-foreground` |
| Error text | `text-base text-red-500` |
| Error hint | `text-sm text-muted-foreground` |

### Discovery Page (`/dashboard/discovery`)

| Element | Class |
|---|---|
| Title | `text-5xl font-bold` |
| Description | `text-xl text-muted-foreground` |
| Tab buttons | `text-lg font-mono uppercase tracking-wider` |
| Tab icons | `h-5 w-5` |
| Card titles (listings/airdrops) | `text-xl` |
| Card descriptions | `text-sm` |
| NEW badge | `text-sm border font-mono` |
| Status badge | `text-sm border font-mono uppercase` |
| Grid data text | `text-sm` |
| Date/time text | `text-sm text-muted-foreground` |
| Calendar/Clock icons | `h-4 w-4` |
| Warning text | `text-sm text-red-400/80 italic` |
| Alert icons | `h-6 w-6` |
| Alert title | `text-base font-medium` |
| Alert body | `text-sm text-muted-foreground` |
| Requirements label | `text-sm font-mono uppercase tracking-wider` |
| Requirement items | `text-sm` |
| CheckCircle2 icon | `h-4 w-4` |
| Learn More icon | `h-4 w-4` |
| Empty state icon | `h-14 w-14` |
| Empty state main | `text-lg` |
| Empty state sub | `text-base` |
| Error text | `text-base text-red-500` |
| Error hint | `text-sm text-muted-foreground` |

### Settings Page (`/settings`)

| Element | Class |
|---|---|
| Card title (Signal Engine) | `text-3xl text-zinc-100` |
| Card title (Alert/System/Deploy) | `text-2xl text-zinc-100` |
| Card description icon | `h-5 w-5` |
| Form labels | `text-base text-zinc-300` |
| Toggle labels | `text-base text-zinc-300` |
| Toggle descriptions | `text-sm text-zinc-500` |
| Action button icons | `h-5 w-5` |
| Page background | `bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.12),transparent_35%),linear-gradient(180deg,#020617_0%,#000_100%)]` |

---

## 7. Borders & Backgrounds

### Borders

| Usage | Class |
|---|---|
| Default border | `border-border` (hsl 240 3.7% 15.9% = `#27272a`) |
| Yellow accent border | `border-yellow-500/15` or `border-yellow-500/20` |
| Red error border | `border-red-500/20` |
| Green success border | `border-green-500/30` |
| Card border | `border-border bg-card/90` |
| Active nav item | `border-l-2 border-yellow-500` |

### Backgrounds

| Usage | Class |
|---|---|
| Page background | `bg-background` (dark: `#000000`) |
| Card background | `bg-card/90` or `bg-card` |
| Muted background | `bg-muted` |
| Accent background | `bg-accent` |
| Yellow tint | `bg-yellow-500/5` or `bg-yellow-500/10` |
| Red tint | `bg-red-500/5` |
| Gradient (logo) | `bg-gradient-to-br from-yellow-400 to-yellow-600` |
| Gradient (affiliate) | `bg-gradient-to-r from-yellow-500/10 to-yellow-600/5` |
| Dashboard hero bg | `bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.14),transparent_38%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--card))_35%,hsl(var(--background))_100%)]` |
| Settings bg | `bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.12),transparent_35%),linear-gradient(180deg,#020617_0%,#000_100%)]` |

---

## 8. Border Radius

| Class | Value |
|---|---|
| `rounded-lg` | `var(--radius)` = `0.5rem` (8px) |
| `rounded-xl` | `calc(var(--radius) + 4px)` = 12px |
| `rounded-full` | 9999px (badges, dots) |

---

## 9. Animations & Transitions

| Usage | Class |
|---|---|
| Nav item hover | `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]` |
| Sidebar toggle | `transition-all duration-300 ease-in-out` |
| Status dot | `animate-pulse` |
| Mobile overlay | `animate-in fade-in transition-opacity duration-300` |
| Chevron rotation | `transition-transform duration-200` |

---

## 10. Spacing Reference

| Class | Value |
|---|---|
| `space-y-5` | 20px (nav items, sub-items) |
| `space-y-6` | 24px (page sections) |
| `space-y-4` | 16px (footer, preferences) |
| `space-y-3` | 12px (card content) |
| `gap-3` | 12px (icon-text gap) |
| `gap-4` | 16px (grid gap) |
| `px-4 py-3` | 16px / 12px (nav items) |
| `px-5 py-4` | 20px / 16px (affiliate banner, module links) |
| `p-6` | 24px (card padding) |
| `p-5` | 20px (disclaimer) |

---

## 11. Files With Pattern Applied

| File | Description |
|---|---|
| `components/Sidebar.tsx` | Sidebar navigation, logo, footer |
| `components/DashboardWorkspace.tsx` | Dashboard hero, search, metric cards, modules |
| `components/Disclaimer.tsx` | Financial disclaimer banner |
| `components/StreakBadge.tsx` | Login streak badge |
| `components/AdSlot.tsx` | Ad slots, affiliate banners, AffiliateCTA |
| `app/[locale]/dashboard/signals/page.tsx` | Signal history page |
| `app/[locale]/dashboard/performance/page.tsx` | Engine performance page |
| `app/[locale]/dashboard/backtest/page.tsx` | Backtest results page |
| `app/[locale]/dashboard/discovery/page.tsx` | Market discovery page |
| `app/[locale]/settings/page.tsx` | Settings page |
| `app/globals.css` | Global CSS variables and base styles |
| `tailwind.config.js` | Tailwind configuration |

---

## 12. Rule for New UI Elements

When adding new listing cards, boxes, or pages (crypto + global stocks combined):

1. **Match the closest existing element type** for sizing
2. **Page titles** → `text-5xl font-bold`
3. **Page descriptions** → `text-xl text-muted-foreground`
4. **Card titles** → `text-2xl` or `text-3xl`
5. **Card content text** → `text-base` or `text-sm`
6. **Badges** → `text-sm` with appropriate color border
7. **Icons in cards** → `h-5 w-5`
8. **Icons in alerts** → `h-6 w-6`
9. **Empty state icons** → `h-14 w-14`
10. **Table text** → `text-lg` with `text-base uppercase tracking-wider` headers
11. **Form labels** → `text-base text-muted-foreground`
12. **Metric values** → `text-4xl font-bold`
13. **Use `font-mono uppercase tracking-wider`** for labels, badges, nav items
14. **Use `font-sans`** for body text and buttons
15. **Yellow accent** → `text-yellow-500`, `border-yellow-500/20`, `bg-yellow-500/5`
16. **Borders** → `border-border` (default), `border-yellow-500/15` (accent)
17. **Card style** → `border-border bg-card/90`
