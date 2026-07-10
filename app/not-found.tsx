import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ margin: 0, padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', color: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
        <p style={{ color: '#a3a3a3', marginBottom: '1.5rem' }}>The page you are looking for does not exist.</p>
        <Link href="/dashboard" style={{ color: '#22c55e', textDecoration: 'underline' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
