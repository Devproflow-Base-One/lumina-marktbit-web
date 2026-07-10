'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  Zap,
  Circle,
  X,
  Menu,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMobileMenu } from '@/lib/mobile-menu-context'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'signal' | 'system' | 'alert'
}

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'signal' | 'coin' | 'stock'
  [key: string]: any
}

interface SearchResponse {
  signals: SearchResult[]
  coins: SearchResult[]
  stocks: SearchResult[]
}

const TopHeader: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [systemOnline, setSystemOnline] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResponse>({
    signals: [],
    coins: [],
    stocks: [],
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu()

  const notificationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Signal: BTC',
      message: 'BUY signal detected with 92% confidence',
      time: '2 min ago',
      type: 'signal',
    },
    {
      id: '2',
      title: 'Engine Status',
      message: 'Signal engine completed scan of 150+ coins',
      time: '15 min ago',
      type: 'system',
    },
    {
      id: '3',
      title: 'Market Alert',
      message: 'US market opened — AAPL, TSLA, NVDA now tracking',
      time: '1 hour ago',
      type: 'alert',
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Simulate system status blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemOnline(prev => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults({ signals: [], coins: [], stocks: [] })
      setSearchOpen(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SIGNAL_API_URL || 'http://localhost:8787'}/api/v1/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data)
        setSearchOpen(true)
      }
    } catch {
      setSearchResults({ signals: [], coins: [], stocks: [] })
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle search input with debounce
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value
      setSearchQuery(query)
      setSearchFocused(true)

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Set new timeout for debounce
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query)
      }, 300) // 300ms debounce
    },
    [performSearch]
  )

  // Handle search input focus
  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true)
    if (searchQuery.length >= 2) {
      setSearchOpen(true)
    }
  }, [searchQuery])

  // Handle search input blur
  const handleSearchBlur = useCallback(() => {
    setSearchFocused(false)
    // Delay closing to allow click on results
    setTimeout(() => {
      setSearchOpen(false)
    }, 150)
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults({ signals: [], coins: [], stocks: [] })
    setSearchOpen(false)
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'signal':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'system':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'alert':
        return <div className="w-2 h-2 bg-amber-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-zinc-500 rounded-full" />
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="xl:hidden mr-4 p-2"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
        {/* Market Selector */}
        <div className="relative mr-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 transition-colors border border-border"
          >
            <Activity className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-foreground">MarktBit</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
              HYBRID
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Left Section - Omni Search */}
        <div className="flex-1 max-w-xl hidden sm:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search BTC, ETH, AAPL, TSLA..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className={cn(
                'pl-9 pr-9 py-1.5 bg-input/50 border-border text-sm text-foreground placeholder-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring',
                'transition-all duration-200',
                searchFocused && 'ring-2 ring-ring/50 border-ring'
              )}
            />
            {/* Clear button or keyboard shortcut */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="p-1 h-6 w-6 hover:bg-accent/50 transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </Button>
              ) : (
                <>
                  <kbd className="px-1 py-0.5 text-[10px] bg-muted border border-border rounded text-muted-foreground">
                    Ctrl
                  </kbd>
                  <kbd className="px-1 py-0.5 text-[10px] bg-muted border border-border rounded text-muted-foreground">
                    K
                  </kbd>
                </>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card/90 backdrop-blur-xl border border-border rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Signals Section */}
                    {searchResults.signals.length > 0 && (
                      <div className="p-2">
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-yellow-400 uppercase tracking-wider font-mono">
                          <Zap className="h-3 w-3" />
                          Signals
                        </div>
                        {searchResults.signals.map(sig => (
                          <div
                            key={sig.id}
                            className="px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors rounded"
                            onClick={() => clearSearch()}
                          >
                            <div className="text-sm font-medium text-foreground">{sig.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{sig.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coins Section */}
                    {searchResults.coins.length > 0 && (
                      <div className="p-2">
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
                          <Activity className="h-3 w-3" />
                          Coins
                        </div>
                        {searchResults.coins.map(coin => (
                          <div
                            key={coin.id}
                            className="px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors rounded"
                            onClick={() => clearSearch()}
                          >
                            <div className="text-sm font-medium text-foreground">{coin.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{coin.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stocks Section */}
                    {searchResults.stocks.length > 0 && (
                      <div className="p-2">
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-green-400 uppercase tracking-wider font-mono">
                          <TrendingUp className="h-3 w-3" />
                          Stocks
                        </div>
                        {searchResults.stocks.map(stock => (
                          <div
                            key={stock.id}
                            className="px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors rounded"
                            onClick={() => clearSearch()}
                          >
                            <div className="text-sm font-medium text-foreground">{stock.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stock.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {searchResults.signals.length === 0 &&
                      searchResults.coins.length === 0 &&
                      searchResults.stocks.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                          <div className="text-sm">No results found</div>
                          <div className="text-xs mt-1">Try searching for BTC, ETH, AAPL, TSLA...</div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-1.5 hover:bg-accent transition-colors h-8 w-8"
            >
              <Bell className="h-4 w-4 text-foreground" />
              {/* Unread indicator */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground font-mono uppercase tracking-wider">Notifications</h3>
                  <p className="text-base text-muted-foreground mt-1">3 unread messages</p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="p-3 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
                    Mark all as read
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-card/50 border border-border rounded-full">
            <div className="flex items-center gap-1">
              <Circle className={cn('h-3 w-3 fill-current', systemOnline ? 'text-yellow-500' : 'text-yellow-700')} />
              <span className="text-xs text-muted-foreground">System: {systemOnline ? 'Online' : 'Syncing...'}</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-foreground font-mono uppercase tracking-wider">User</p>
              <p className="text-xs text-muted-foreground">MarktBit</p>
            </div>
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">MB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopHeader
