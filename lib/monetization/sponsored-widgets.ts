/**
 * LUMINA MARKTBIT - SPONSORED MICRO-WIDGET SYSTEM
 * High-CPM sponsored action widgets with fast payout cycles
 */

interface SponsoredWidget {
  sponsor: string;
  cpm: number;
  payoutCycle: string;
  widget: string;
  category: string;
  priority: number;
}

const SPONSORED_WIDGETS: Record<string, SponsoredWidget> = {
  binance_trade: {
    sponsor: 'Binance',
    cpm: 80,
    payoutCycle: 'Weekly',
    category: 'crypto',
    priority: 1,
    widget: `
      <div class="lumina-quick-action" data-sponsor="binance" style="display:flex;align-items:center;gap:8px;padding:12px;background:linear-gradient(135deg,#f0b90b,#f8d12f);border-radius:8px;cursor:pointer;box-shadow:0 2px 8px rgba(240,185,11,0.3);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#000"/><path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#000"/></svg>
        <span style="color:#000;font-weight:600;font-size:14px;">Trade on Binance</span>
      </div>
    `
  },
  bybit_futures: {
    sponsor: 'Bybit',
    cpm: 75,
    payoutCycle: 'Bi-weekly',
    category: 'crypto',
    priority: 1,
    widget: `
      <div class="lumina-quick-action" data-sponsor="bybit" style="display:flex;align-items:center;gap:8px;padding:12px;background:linear-gradient(135deg,#f7a600,#ffb800);border-radius:8px;cursor:pointer;box-shadow:0 2px 8px rgba(247,166,0,0.3);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#000"/></svg>
        <span style="color:#000;font-weight:600;font-size:14px;">Bybit Futures</span>
      </div>
    `
  },
  tradingview_premium: {
    sponsor: 'TradingView',
    cpm: 60,
    payoutCycle: 'Monthly',
    category: 'stocks',
    priority: 2,
    widget: `
      <div class="lumina-quick-action" data-sponsor="tradingview" style="display:flex;align-items:center;gap:8px;padding:12px;background:linear-gradient(135deg,#2962ff,#3d7eff);border-radius:8px;cursor:pointer;box-shadow:0 2px 8px rgba(41,98,255,0.3);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 13L9 7L13 11L21 3" stroke="#fff" stroke-width="2"/></svg>
        <span style="color:#fff;font-weight:600;font-size:14px;">TradingView Pro</span>
      </div>
    `
  },
  adsterra_display: {
    sponsor: 'Adsterra',
    cpm: 45,
    payoutCycle: 'Weekly',
    category: 'display',
    priority: 3,
    widget: `
      <div class="lumina-ad-banner" data-sponsor="adsterra" style="width:100%;height:90px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid #e0e0e0;">
        <span style="color:#999;font-size:12px;">Advertisement</span>
      </div>
    `
  },
  propellerads_push: {
    sponsor: 'PropellerAds',
    cpm: 50,
    payoutCycle: 'Weekly',
    category: 'push',
    priority: 3,
    widget: `
      <div class="lumina-push-widget" data-sponsor="propellerads" style="position:fixed;bottom:20px;right:20px;width:320px;padding:16px;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.15);z-index:9999;">
        <div style="display:flex;gap:12px;">
          <div style="width:48px;height:48px;background:#4CAF50;border-radius:8px;"></div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px;">Market Alert</div>
            <div style="font-size:12px;color:#666;">New trading opportunity detected</div>
          </div>
        </div>
      </div>
    `
  }
};

export class SponsoredWidgetManager {
  private impressions: Map<string, number> = new Map();
  private clicks: Map<string, number> = new Map();

  public injectWidget(category: string, position: 'top' | 'bottom' | 'sidebar' = 'bottom'): void {
    if (typeof document === 'undefined') return;

    const widgets = Object.entries(SPONSORED_WIDGETS)
      .filter(([_, widget]) => widget.category === category)
      .sort((a, b) => a[1].priority - b[1].priority);

    if (widgets.length === 0) return;

    const [widgetId, widgetData] = widgets[0];
    const container = document.createElement('div');
    container.innerHTML = widgetData.widget;
    container.id = `lumina-widget-${widgetId}`;

    const widgetElement = container.firstElementChild as HTMLElement;
    if (!widgetElement) return;

    widgetElement.addEventListener('click', () => {
      this.trackClick(widgetId);
      this.handleWidgetClick(widgetId);
    });

    this.insertWidget(widgetElement, position);
    this.trackImpression(widgetId);
  }

  private insertWidget(element: HTMLElement, position: string): void {
    switch (position) {
      case 'top':
        document.body.insertBefore(element, document.body.firstChild);
        break;
      case 'bottom':
        document.body.appendChild(element);
        break;
      case 'sidebar':
        const sidebar = document.querySelector('.sidebar') || document.body;
        sidebar.appendChild(element);
        break;
    }
  }

  private trackImpression(widgetId: string): void {
    const count = (this.impressions.get(widgetId) || 0) + 1;
    this.impressions.set(widgetId, count);

    const widget = SPONSORED_WIDGETS[widgetId];
    this.sendTelemetry({
      event: 'widget_impression',
      sponsor: widget.sponsor,
      cpm: widget.cpm,
      widgetId,
      timestamp: new Date().toISOString()
    });
  }

  private trackClick(widgetId: string): void {
    const count = (this.clicks.get(widgetId) || 0) + 1;
    this.clicks.set(widgetId, count);

    const widget = SPONSORED_WIDGETS[widgetId];
    this.sendTelemetry({
      event: 'widget_click',
      sponsor: widget.sponsor,
      widgetId,
      timestamp: new Date().toISOString()
    });
  }

  private handleWidgetClick(widgetId: string): void {
    const widget = SPONSORED_WIDGETS[widgetId];
    const affiliateUrls: Record<string, string> = {
      binance: 'https://www.binance.com/en/register?ref=lumina-binance',
      bybit: 'https://www.bybit.com/invite?ref=lumina-bybit',
      tradingview: 'https://www.tradingview.com/gopro/?share_your_love=lumina-tv'
    };

    const url = affiliateUrls[widget.sponsor.toLowerCase()];
    if (url) {
      window.open(url, '_blank');
    }
  }

  private async sendTelemetry(data: any): Promise<void> {
    try {
      await fetch('/api/monetization/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('[SPONSORED_WIDGETS] Telemetry failed:', error);
    }
  }

  public getRevenue(): number {
    let totalRevenue = 0;
    this.impressions.forEach((count, widgetId) => {
      const widget = SPONSORED_WIDGETS[widgetId];
      if (widget) {
        totalRevenue += (count / 1000) * widget.cpm;
      }
    });
    return totalRevenue;
  }

  public getStats() {
    return {
      totalImpressions: Array.from(this.impressions.values()).reduce((a, b) => a + b, 0),
      totalClicks: Array.from(this.clicks.values()).reduce((a, b) => a + b, 0),
      estimatedRevenue: this.getRevenue(),
      widgetBreakdown: Object.keys(SPONSORED_WIDGETS).map(widgetId => ({
        widgetId,
        sponsor: SPONSORED_WIDGETS[widgetId].sponsor,
        impressions: this.impressions.get(widgetId) || 0,
        clicks: this.clicks.get(widgetId) || 0,
        cpm: SPONSORED_WIDGETS[widgetId].cpm,
        payoutCycle: SPONSORED_WIDGETS[widgetId].payoutCycle
      }))
    };
  }
}

export const sponsoredWidgetManager = new SponsoredWidgetManager();
