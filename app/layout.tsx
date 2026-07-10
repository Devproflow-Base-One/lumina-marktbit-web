import type { Metadata, Viewport } from 'next'
import './globals.css'
import { getBrandingConfig } from './config/branding'
import { MonetizationProvider } from '@/lib/monetization/provider'

export const dynamic = 'force-dynamic'

// Get dynamic branding configuration
const branding = getBrandingConfig()

export const metadata: Metadata = {
  title: branding.title,
  description: branding.description,
  authors: [{ name: branding.author }],
  icons: {
    icon: branding.faviconUrl || '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <MonetizationProvider>{children}</MonetizationProvider>
}
