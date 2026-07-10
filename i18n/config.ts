export const locales = [
  'en', 'id', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko', 'zh',
  'ar', 'hi', 'tr', 'vi', 'th', 'nl', 'it', 'pl', 'ms', 'fa'
] as const
export const defaultLocale = 'en' as const
export type Locale = (typeof locales)[number]

export const localeLabels: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  id: { name: 'Indonesia', flag: '🇮🇩' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  pt: { name: 'Português', flag: '🇵🇹' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  zh: { name: '中文', flag: '🇨🇳' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
  th: { name: 'ไทย', flag: '🇹🇭' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  ms: { name: 'Melayu', flag: '🇲🇾' },
  fa: { name: 'فارسی', flag: '🇮🇷' },
}
