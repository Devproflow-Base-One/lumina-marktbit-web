import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { locales } from '@/i18n'
import '../globals.css'
import { Toaster } from '@/components/ui/toaster'
import { BrandingProvider } from '@/components/BrandingProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getBrandingConfig } from '../config/branding'
import { ReactQueryProvider } from '@/lib/react-query-provider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { MobileMenuProvider } from '@/lib/mobile-menu-context'
import { PostHogProvider } from '@/components/PostHogProvider'
import { AppShell } from '@/components/AppShell'

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Get messages for the locale
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans">
        <PostHogProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <ReactQueryProvider>
                <MobileMenuProvider>
                  <BrandingProvider>
                    <ThemeProvider>
                      <div className="min-h-screen bg-background text-foreground">
                        <AppShell>
                          <main id="main-content" tabIndex={-1}>
                            {children}
                          </main>
                        </AppShell>
                        <Toaster />
                      </div>
                    </ThemeProvider>
                  </BrandingProvider>
                </MobileMenuProvider>
              </ReactQueryProvider>
            </ErrorBoundary>
          </NextIntlClientProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
