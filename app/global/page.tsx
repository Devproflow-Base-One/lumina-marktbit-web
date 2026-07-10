import { redirect } from 'next/navigation'

export default function StocksGlobalLandingPage() {
  redirect('/en/dashboard?tab=us')
}
