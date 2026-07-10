import { redirect } from 'next/navigation'

export default function CryptoDashboardPage() {
  redirect('/en/dashboard?tab=crypto')
}
