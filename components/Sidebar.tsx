'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useIsAdmin } from '@/lib/store'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useMobileMenu } from '@/lib/mobile-menu-context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Activity,
  TrendingUp,
  History,
  BarChart3,
  Settings,
  Lock,
  Menu,
  X,
  Zap,
  Compass,
  Rocket,
  Gift,
} from 'lucide-react'

interface NavItem {
  title: string
  href?: string
  icon?: React.ElementType
  items?: NavItem[]
  badge?: string
  adminOnly?: boolean
}

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onCollapse?: () => void
}

export function Sidebar({ className, collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = useIsAdmin()
  const t = useTranslations('navigation')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['Market Discovery']))
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu()

  const navigationItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Signals',
      href: '/dashboard/signals',
      icon: Activity,
      badge: 'LIVE',
    },
    {
      title: 'Performance',
      href: '/dashboard/performance',
      icon: TrendingUp,
    },
    {
      title: 'Backtest',
      href: '/dashboard/backtest',
      icon: History,
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      title: 'Market Discovery',
      icon: Compass,
      badge: 'NEW',
      items: [
        {
          title: 'New Listings',
          href: '/dashboard/discovery?tab=new',
          icon: Rocket,
        },
        {
          title: 'Airdrop Tracker',
          href: '/dashboard/discovery?tab=airdrop',
          icon: Gift,
        },
      ],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ]

  const toggleItem = (title: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(title)) {
      newOpenItems.delete(title)
    } else {
      newOpenItems.add(title)
    }
    setOpenItems(newOpenItems)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, level: number = 0) => {
    // Hide admin-only items if user is not admin
    if (item.adminOnly && !isAdmin) {
      return null
    }

    const hasSubItems = item.items && item.items.length > 0
    const isOpen = openItems.has(item.title)
    const Icon = item.icon

    if (hasSubItems) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)} className="w-full pt-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between text-left hover:bg-accent hover:text-yellow-500 transition-all duration-200',
                'px-4 py-3 rounded-lg font-medium hover:scale-[1.02] active:scale-[0.98]',
                collapsed && 'justify-center px-2 py-2'
              )}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon className={cn('h-4 w-4 transition-colors', isOpen ? 'text-yellow-500' : 'text-muted-foreground')} />
                )}
                {!collapsed && (
                  <span className={cn('text-xs transition-colors font-mono tracking-wider uppercase', isOpen ? 'text-yellow-500' : 'text-foreground')}>
                    {item.title}
                  </span>
                )}
              </div>
              {!collapsed && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isOpen ? 'rotate-180 text-yellow-500' : 'text-muted-foreground'
                  )}
                />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {!collapsed &&
              item.items?.map(subItem => (
                <Link
                  key={subItem.href}
                  href={subItem.href || '#'}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg text-xs uppercase transition-all duration-200',
                    'hover:bg-accent hover:text-yellow-500 hover:scale-[1.02] active:scale-[0.98]',
                    isActive(subItem.href || '')
                      ? 'bg-accent text-yellow-500 border-l-2 border-yellow-500'
                      : 'text-muted-foreground'
                  )}
                >
                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                  <span className="flex-1 text-xs uppercase">{subItem.title}</span>
                  {subItem.badge && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs rounded-full font-medium',
                        subItem.badge === 'LIVE'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      )}
                    >
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              ))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href || '#'}
        className={cn(
          'flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium uppercase transition-all duration-200',
          'hover:bg-accent hover:text-yellow-500 hover:scale-[1.02] active:scale-[0.98]',
          isActive(item.href || '') ? 'bg-accent text-yellow-500 border-l-2 border-yellow-500' : 'text-muted-foreground'
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {!collapsed && <span className="flex-1 text-xs uppercase">{item.title}</span>}
        {item.badge && !collapsed && (
          <span
            className={cn(
              'px-2 py-0.5 text-xs rounded-full font-medium',
              item.badge === 'LIVE'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out fixed lg:relative z-50',
          collapsed ? 'w-14' : 'w-52',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-black" />
            </div>
            <span className="text-base font-bold text-foreground font-mono uppercase tracking-wider">MarktBit</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onCollapse?.()
            setIsMobileMenuOpen(false)
          }}
          className={cn(
            'text-muted-foreground hover:text-yellow-500 hover:bg-accent transition-colors',
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">{navigationItems.map(item => renderNavItem(item))}</nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        {!collapsed && (
          <div className="space-y-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span>System Online</span>
            </div>
            <div className="text-xs text-muted-foreground/60">Version 2.0.1</div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Sidebar
