/**
 * Next.js Instrumentation — LUMINA MARKTBIT
 * Auto-starts Overmind telemetry heartbeat on server boot.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production' && !process.env.NEXT_PRIVATE_BUILD_CACHE) {
    try {
      const { startTelemetryHeartbeat } = await import('./lib/overmind-telemetry')
      startTelemetryHeartbeat()
    } catch (e) {
      console.warn('[TELEMETRY] Failed to start (non-fatal):', e)
    }
  }
}
