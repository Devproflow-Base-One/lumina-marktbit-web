import { redirect } from 'next/navigation'

export default function StocksIdLandingPage() {
  redirect('/en/dashboard?tab=saham')
}
