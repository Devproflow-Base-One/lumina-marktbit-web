import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { locales, defaultLocale } from './config'

export default getRequestConfig(async () => {
  const headerList = await headers()
  const locale = headerList.get('x-next-intl-locale') || defaultLocale

  if (!locales.includes(locale as any)) notFound()

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
