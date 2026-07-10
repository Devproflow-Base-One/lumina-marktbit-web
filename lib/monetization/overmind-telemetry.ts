/**
 * LUMINA MARKTBIT → OVERMIND TELEMETRY BRIDGE
 * Silent monetization data transmission to Overmind orchestrator
 */

interface MonetizationMetrics {
  affiliateImpressions: number;
  affiliateClicks: number;
  affiliateConversions: number;
  widgetImpressions: number;
  widgetClicks: number;
  estimatedRevenue: number;
  timestamp: string;
}

export class OvermindTelemetry {
  private overmindEndpoint: string;
  private syncInterval: number;
  private apiKey: string;

  constructor() {
    this.overmindEndpoint = process.env.NEXT_PUBLIC_OVERMIND_API_URL || 'http://localhost:8000';
    this.syncInterval = 60000;
    this.apiKey = process.env.LUMINA_OVERMIND_TOKEN || '';
  }

  public startSync(): void {
    this.syncMetrics();
    setInterval(() => this.syncMetrics(), this.syncInterval);
  }

  private async syncMetrics(): Promise<void> {
    const metrics = this.collectMetrics();
    
    try {
      const response = await fetch(`${this.overmindEndpoint}/api/v1/telemetry/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'lumina-marktbit'
        },
        body: JSON.stringify({
          source: 'lumina-marktbit',
          event_type: 'monetization_sync',
          metrics,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.warn('[OVERMIND_TELEMETRY] Sync failed:', response.status);
      }
    } catch (error) {
      console.error('[OVERMIND_TELEMETRY] Sync error:', error);
    }
  }

  private collectMetrics(): MonetizationMetrics {
    const affiliateImpressions = parseInt(localStorage.getItem('affiliate_impressions') || '0');
    const affiliateClicks = parseInt(localStorage.getItem('affiliate_clicks') || '0');
    const affiliateConversions = parseInt(localStorage.getItem('affiliate_conversions') || '0');
    
    const widgetStats = this.getWidgetStats();
    
    return {
      affiliateImpressions,
      affiliateClicks,
      affiliateConversions,
      widgetImpressions: widgetStats.impressions,
      widgetClicks: widgetStats.clicks,
      estimatedRevenue: this.calculateRevenue(affiliateConversions, widgetStats.impressions),
      timestamp: new Date().toISOString()
    };
  }

  private getWidgetStats(): { impressions: number; clicks: number } {
    const impressions = parseInt(localStorage.getItem('widget_impressions') || '0');
    const clicks = parseInt(localStorage.getItem('widget_clicks') || '0');
    return { impressions, clicks };
  }

  private calculateRevenue(conversions: number, impressions: number): number {
    const avgCPA = 25;
    const avgCPM = 60;
    return (conversions * avgCPA) + ((impressions / 1000) * avgCPM);
  }

  public async sendEvent(eventType: string, data: any): Promise<void> {
    try {
      await fetch(`${this.overmindEndpoint}/api/v1/telemetry/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source': 'lumina-marktbit'
        },
        body: JSON.stringify({
          source: 'lumina-marktbit',
          event_type: eventType,
          data,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('[OVERMIND_TELEMETRY] Event send failed:', error);
    }
  }
}

export const overmindTelemetry = new OvermindTelemetry();
