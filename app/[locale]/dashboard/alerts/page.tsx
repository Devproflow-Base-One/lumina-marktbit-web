'use client'

import { useAlertStore } from '@/lib/stores'

export default function AlertsPage() {
  const { alerts, removeAlert, toggleAlert, clearTriggered } = useAlertStore()
  const activeAlerts = alerts.filter((a) => a.active && !a.triggered)
  const triggeredAlerts = alerts.filter((a) => a.triggered)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Alerts</h1>
        <div className="flex gap-2">
          {triggeredAlerts.length > 0 && (
            <button
              onClick={clearTriggered}
              className="rounded-lg border border-yellow-500/20 px-3 py-1.5 text-sm text-yellow-400 hover:bg-yellow-500/10"
            >
              Clear Triggered
            </button>
          )}
          <button className="rounded-lg bg-yellow-500 px-4 py-1.5 text-sm font-semibold text-black hover:bg-yellow-400">
            + Create Alert
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
          Active ({activeAlerts.length})
        </h2>
        {activeAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active alerts.</p>
        ) : (
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-400">{alert.symbol}</span>
                  <span className="text-sm text-muted-foreground">{alert.name}</span>
                  <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs">
                    {alert.type.replace(/_/g, ' ')} {alert.threshold}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="text-xs text-muted-foreground hover:text-yellow-400"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            Triggered ({triggeredAlerts.length})
          </h2>
          <div className="space-y-2">
            {triggeredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-400">{alert.symbol}</span>
                  <span className="text-sm text-muted-foreground">{alert.type.replace(/_/g, ' ')}</span>
                  {alert.triggeredAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.triggeredAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
