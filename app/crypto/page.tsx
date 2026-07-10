import { redirect } from 'next/navigation'

export default function CryptoLandingPage() {
  redirect('/en/dashboard?tab=crypto')
}
