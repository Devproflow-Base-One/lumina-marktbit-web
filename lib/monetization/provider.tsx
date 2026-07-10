'use client'

import { useEffect } from 'react'
import { affiliateInjector } from './affiliate-injector'
import { sponsoredWidgetManager } from './sponsored-widgets'
import { overmindTelemetry } from './overmind-telemetry'

export function MonetizationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    affiliateInjector.injectAffiliateLinks()
    sponsoredWidgetManager.injectWidget('crypto', 'bottom')
    overmindTelemetry.startSync()
    
    const observer = new MutationObserver(() => {
      affiliateInjector.injectAffiliateLinks()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    return () => observer.disconnect()
  }, [])
  
  return <>{children}</>
}
