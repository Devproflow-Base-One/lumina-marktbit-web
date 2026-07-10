/**
 * LUMINA MARKTBIT - AFFILIATE LINK AUTO-INJECTOR
 * Silent affiliate link injection for maximum passive revenue
 */

interface AffiliateConfig {
  tag: string;
  domains: string[];
  commission: string;
  priority: number;
}

const AFFILIATE_NETWORKS: Record<string, AffiliateConfig> = {
  binance: {
    tag: 'lumina-binance',
    domains: ['binance.com', 'binance.us'],
    commission: '$20-30 CPA',
    priority: 1
  },
  bybit: {
    tag: 'lumina-bybit',
    domains: ['bybit.com'],
    commission: '$25-35 CPA',
    priority: 1
  },
  coinbase: {
    tag: 'lumina-coinbase',
    domains: ['coinbase.com'],
    commission: '$10-15 CPA',
    priority: 2
  },
  tradingview: {
    tag: 'lumina-tv',
    domains: ['tradingview.com'],
    commission: '30% recurring',
    priority: 2
  },
  etoro: {
    tag: 'lumina-etoro',
    domains: ['etoro.com'],
    commission: '$200-600 CPA',
    priority: 1
  }
};

export class AffiliateInjector {
  private impressionCount: number = 0;
  private clickCount: number = 0;
  private conversionCount: number = 0;

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking(): void {
    if (typeof window !== 'undefined') {
      this.impressionCount = parseInt(localStorage.getItem('affiliate_impressions') || '0');
      this.clickCount = parseInt(localStorage.getItem('affiliate_clicks') || '0');
      this.conversionCount = parseInt(localStorage.getItem('affiliate_conversions') || '0');
    }
  }

  public injectAffiliateLinks(): void {
    if (typeof document === 'undefined') return;

    Object.entries(AFFILIATE_NETWORKS).forEach(([network, config]) => {
      config.domains.forEach(domain => {
        const links = document.querySelectorAll(`a[href*="${domain}"]`);
        
        links.forEach((link) => {
          const anchor = link as HTMLAnchorElement;
          const url = new URL(anchor.href);
          
          if (!url.searchParams.has('ref') && !url.searchParams.has('tag')) {
            url.searchParams.set('ref', config.tag);
            anchor.href = url.toString();
            
            anchor.addEventListener('click', () => {
              this.trackClick(network);
            });
            
            this.trackImpression(network);
          }
        });
      });
    });
  }

  private trackImpression(network: string): void {
    this.impressionCount++;
    localStorage.setItem('affiliate_impressions', this.impressionCount.toString());
    
    this.sendTelemetry({
      event: 'affiliate_impression',
      network,
      timestamp: new Date().toISOString()
    });
  }

  private trackClick(network: string): void {
    this.clickCount++;
    localStorage.setItem('affiliate_clicks', this.clickCount.toString());
    
    this.sendTelemetry({
      event: 'affiliate_click',
      network,
      timestamp: new Date().toISOString()
    });
  }

  public trackConversion(network: string, amount: number): void {
    this.conversionCount++;
    localStorage.setItem('affiliate_conversions', this.conversionCount.toString());
    
    this.sendTelemetry({
      event: 'affiliate_conversion',
      network,
      amount,
      timestamp: new Date().toISOString()
    });
  }

  private async sendTelemetry(data: any): Promise<void> {
    try {
      await fetch('/api/monetization/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('[AFFILIATE] Telemetry failed:', error);
    }
  }

  public getStats() {
    return {
      impressions: this.impressionCount,
      clicks: this.clickCount,
      conversions: this.conversionCount,
      ctr: this.impressionCount > 0 ? (this.clickCount / this.impressionCount) * 100 : 0,
      conversionRate: this.clickCount > 0 ? (this.conversionCount / this.clickCount) * 100 : 0
    };
  }
}

export const affiliateInjector = new AffiliateInjector();
