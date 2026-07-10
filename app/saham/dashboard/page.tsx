import { redirect } from 'next/navigation'

export default function StocksIdDashboardPage() {
  redirect('/en/dashboard?tab=saham')
}
