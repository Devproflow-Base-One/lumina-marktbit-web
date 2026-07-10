/**
 * Lumina Overmind Integration for MarktBit
 * God Mode campaign automation, conversion tracking, and budget optimization
 */

import { OvermindClient } from '@lumina/overmind-client';

const overmindClient = new OvermindClient({
  apiUrl: process.env.NEXT_PUBLIC_OVERMIND_API_URL || 'http://localhost:8000',
  apiKey: process.env.OVERMIND_API_KEY || '',
  timeout: 60000,
  retries: 3,
});

/**
 * Run autonomous campaign for crypto/stock signal
 */
export async function runSignalCampaign(signal: {
  asset: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  price: number;
  target_price?: number;
  stop_loss?: number;
  timeframe?: string;
}) {
  const campaign = await overmindClient.godMode.runCampaign({
    product_name: `${signal.asset} ${signal.type} Signal`,
    product_description: `
High-confidence ${signal.type} signal for ${signal.asset}
- Current Price: $${signal.price}
${signal.target_price ? `- Target Price: $${signal.target_price}` : ''}
${signal.stop_loss ? `- Stop Loss: $${signal.stop_loss}` : ''}
- Confidence: ${signal.confidence}%
${signal.timeframe ? `- Timeframe: ${signal.timeframe}` : ''}
    `.trim(),
    target_audience: 'Crypto traders, swing traders, day traders, retail investors',
    channels: ['telegram', 'email', 'whatsapp'],
    duration_days: 1,
  });

  return campaign;
}

/**
 * Track user conversion (subscription, affiliate click, etc.)
 */
export async function trackConversion(event: {
  user_id?: string;
  event_type: 'subscription_purchase' | 'affiliate_click' | 'signal_follow' | 'referral';
  value?: number;
  metadata?: Record<string, any>;
}) {
  await overmindClient.godMode.trackEvent({
    ...event,
    currency: 'USD',
  });
}

/**
 * Get campaign insights and analytics
 */
export async function getCampaignInsights(campaignId: string) {
  return await overmindClient.godMode.getInsights(campaignId);
}

/**
 * Optimize budget allocation across multiple campaigns
 */
export async function optimizeBudget(campaigns: Array<{
  id: string;
  name: string;
  current_budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}>, totalBudget: number) {
  return await overmindClient.godMode.optimizeBudget({
    campaigns: campaigns.map(c => ({
      id: c.id,
      name: c.name,
      current_budget: c.current_budget,
      performance: {
        impressions: c.impressions,
        clicks: c.clicks,
        conversions: c.conversions,
        revenue: c.revenue,
      },
    })),
    total_budget: totalBudget,
    optimization_goal: 'roas',
  });
}

/**
 * Generate AI analysis for signal
 */
export async function generateSignalAnalysis(signal: {
  asset: string;
  type: 'BUY' | 'SELL';
  indicators: Record<string, any>;
  market_context?: string;
}) {
  const requirement = `
Analyze this trading signal and provide detailed insights:

**Asset:** ${signal.asset}
**Signal Type:** ${signal.type}
**Indicators:** ${JSON.stringify(signal.indicators, null, 2)}
${signal.market_context ? `**Market Context:** ${signal.market_context}` : ''}

Provide:
1. Signal Strength (1-10)
2. Key Factors (3-5 bullet points)
3. Risk Assessment (Low/Medium/High)
4. Recommended Action
5. Potential Profit/Loss Scenarios

Format as JSON:
{
  "strength": 8,
  "factors": ["...", "..."],
  "risk": "Medium",
  "action": "...",
  "scenarios": {
    "best_case": "...",
    "base_case": "...",
    "worst_case": "..."
  }
}
`;

  const result = await overmindClient.generator.generateCopy(requirement, 'pro');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

/**
 * Send telemetry to Overmind
 */
export async function sendTelemetry(data: {
  active_users?: number;
  active_signals?: number;
  total_revenue?: number;
  errors_last_hour?: number;
}) {
  try {
    await overmindClient.telemetry.heartbeat({
      product: 'marktbit',
      status: 'healthy',
      uptime: typeof process !== 'undefined' ? process.uptime() : 0,
      memory: typeof process !== 'undefined' ? process.memoryUsage() : {},
      ...data,
    });
  } catch (error) {
    console.error('Error sending telemetry:', error);
  }
}

export default overmindClient;
