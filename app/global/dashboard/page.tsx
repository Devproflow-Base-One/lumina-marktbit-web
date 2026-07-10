import { redirect } from 'next/navigation'

export default function StocksGlobalDashboardPage() {
  redirect('/en/dashboard?tab=us')
}
