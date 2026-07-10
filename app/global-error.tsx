'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: '2rem', fontFamily: "'Inter', sans-serif", background: '#0a0a0a', color: '#fafafa' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Something went wrong</h1>
          <p style={{ color: '#a3a3a3', marginBottom: '1.5rem' }}>
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              background: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
