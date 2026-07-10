'use client'

/**
 * Language Switcher Component
 * Dropdown with 20 languages
 */

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Languages, ChevronDown } from 'lucide-react'
import { locales, localeLabels, type Locale } from '@/i18n'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 hover:bg-accent/50 transition-colors"
      >
        <Languages className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-foreground">{localeLabels[locale as Locale]?.flag}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </Button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-card/90 backdrop-blur-xl border border-border rounded-lg shadow-2xl max-h-64 overflow-y-auto z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent/50 transition-colors ${
                locale === loc ? 'bg-accent/30 text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              <span>{localeLabels[loc].flag}</span>
              <span>{localeLabels[loc].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
