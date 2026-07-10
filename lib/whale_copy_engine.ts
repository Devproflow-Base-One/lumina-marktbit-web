/**
 * WHALE COPY ENGINE — LUMINA MARKTBIT
 * ====================================
 * High-ticket copywriting engine for institutional client acquisition.
 * STRICTLY FORBIDS retail language. Only generates institutional-grade copy
 * targeting Crypto Whales, Hedge Funds, Prop Traders, and Family Offices.
 *
 * FORBIDDEN WORDS: discount, cheap, easy, moon, lambo, ape, diamond hands,
 *   pump, hodl, to the moon, free money, giveaway, airdrop, retail.
 *
 * HIGH-TICKET TRIGGERS: Institutional-grade latency, Algorithmic whale tracking,
 *   Unfair market advantage, Exclusive Alpha API, Enterprise-grade radar.
 */

// ─── STRICT RULE ENFORCEMENT ─────────────────────────────────────────

/**
 * Words that MUST NEVER appear in whale-tier copy.
 * If any of these are detected in generated text, the copy is rejected.
 */
export const FORBIDDEN_RETAIL_WORDS: string[] = [
  'discount',
  'cheap',
  'easy',
  'moon',
  'lambo',
  'ape',
  'diamond hands',
  'pump',
  'hodl',
  'to the moon',
  'free money',
  'giveaway',
  'airdrop',
  'retail',
  'sale',
  'bargain',
  'deal',
  'low cost',
  'budget',
  'affordable',
  'beginner',
  'newbie',
  'noob',
  'simple',
  'basic plan',
  'starter',
  'free trial',
  'crypto bro',
  'wen',
  'wagmi',
  'gm',
  'ser',
  'fam',
  'degen',
  'yield farming',
  'memecoin',
  'shitcoin',
  'pump and dump',
  'rug pull',
  '100x',
  '1000x',
  'guaranteed profit',
  'risk free',
  'no risk',
]

/**
 * High-ticket trigger phrases that MUST be leveraged in whale copy.
 * These convey institutional sophistication and exclusivity.
 */
export const HIGH_TICKET_TRIGGERS: string[] = [
  'Institutional-grade latency',
  'Algorithmic whale tracking',
  'Unfair market advantage',
  'Exclusive Alpha API',
  'Enterprise-grade radar',
  'Sub-millisecond execution intelligence',
  'Order block analytics',
  'Liquidity pool mapping',
  'Whale wallet surveillance',
  'Cross-exchange arbitrage signals',
  'Sharpe ratio optimization',
  'AUM-weighted portfolio signals',
  'Institutional order flow detection',
  'Dark pool activity monitoring',
  'Quantitative signal verification',
  'Enterprise-grade infrastructure',
  'Dedicated alpha feed',
  'Private institutional channel access',
  'Custom algorithm deployment',
  'Regulatory-compliant signal delivery',
]

// ─── TARGET PERSONAS ─────────────────────────────────────────────────

export interface WhalePersona {
  id: string
  label: string
  title_patterns: string[]
  pain_points: string[]
  channel: 'LinkedIn' | 'Twitter (X)' | 'Direct Email'
  hook_angle: string
}

export const WHALE_PERSONAS: WhalePersona[] = [
  {
    id: 'fund_manager',
    label: 'Fund Manager',
    title_patterns: [
      'Portfolio Manager',
      'Fund Manager',
      'Hedge Fund Manager',
      'Asset Manager',
      'Chief Investment Officer',
      'CIO',
    ],
    pain_points: [
      'Latency between signal generation and execution erodes alpha',
      'No single source of truth for cross-exchange whale activity',
      'Retail signal providers lack institutional-grade infrastructure',
    ],
    channel: 'LinkedIn',
    hook_angle:
      'Your fund deserves better than retail signal Telegrams. MarktBit delivers institutional-grade latency with algorithmic whale tracking — built for AUM-weighted execution.',
  },
  {
    id: 'quant_analyst',
    label: 'Quantitative Analyst',
    title_patterns: [
      'Quantitative Analyst',
      'Quant Researcher',
      'Quant Trader',
      'Algorithmic Trader',
      'Systematic Trader',
      'Data Scientist — Trading',
    ],
    pain_points: [
      'Signal-to-execution gap measured in seconds, not milliseconds',
      'No access to order block analytics or dark pool monitoring',
      'Existing tools lack API depth for custom algorithm integration',
    ],
    channel: 'LinkedIn',
    hook_angle:
      'MarktBit\'s Exclusive Alpha API gives your models sub-millisecond whale wallet surveillance and liquidity pool mapping. Stop trading on delayed retail feeds.',
  },
  {
    id: 'family_office',
    label: 'Family Office Director',
    title_patterns: [
      'Family Office Director',
      'Family Office CIO',
      'Wealth Manager',
      'Private Wealth Advisor',
      'Multi-Family Office Principal',
    ],
    pain_points: [
      'Crypto exposure lacks institutional-grade risk frameworks',
      'No Sharpe ratio optimization tools for digital asset allocation',
      'Concerned about regulatory compliance in signal sourcing',
    ],
    channel: 'LinkedIn',
    hook_angle:
      'Preserve family wealth with enterprise-grade radar. MarktBit provides regulatory-compliant signal delivery with AUM-weighted portfolio signals — the institutional standard for digital assets.',
  },
  {
    id: 'prop_trader',
    label: 'Prop Trader',
    title_patterns: [
      'Proprietary Trader',
      'Prop Trader',
      'Desk Trader',
      'Flow Trader',
      'Market Maker',
    ],
    pain_points: [
      'Need cross-exchange arbitrage signals with institutional-grade latency',
      'Existing signal providers are retail-focused with no API depth',
      'No dark pool activity monitoring for size execution',
    ],
    channel: 'Twitter (X)',
    hook_angle:
      'Stop trading against retail noise. MarktBit\'s institutional order flow detection and dark pool monitoring give your desk an unfair market advantage.',
  },
  {
    id: 'crypto_whale',
    label: 'Crypto Whale (HNWI)',
    title_patterns: [
      'Crypto Investor',
      'Digital Asset Manager',
      'Blockchain Investor',
      'Crypto Whale',
      'High Net Worth Crypto',
    ],
    pain_points: [
      'Whale wallet movements detected too late for actionable response',
      'No private institutional channel for size-aware signal delivery',
      'Retail platforms leak position sizing information',
    ],
    channel: 'Twitter (X)',
    hook_angle:
      'Your size deserves privacy. MarktBit\'s whale wallet surveillance tracks institutional flows before they hit the tape. Private institutional channel access — no retail noise.',
  },
]

// ─── COPY GENERATION ─────────────────────────────────────────────────

export interface GeneratedCopy {
  headline: string
  subheadline: string
  body: string
  cta: string
  triggers_used: string[]
  persona: WhalePersona
  validation_passed: boolean
  rejected_words: string[]
}

/**
 * Validate that copy contains ZERO forbidden retail words.
 * Returns list of violations (empty = passed).
 */
export function validateCopy(text: string): string[] {
  const lower = text.toLowerCase()
  const violations: string[] = []
  for (const word of FORBIDDEN_RETAIL_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      violations.push(word)
    }
  }
  return violations
}

/**
 * Generate institutional-grade ad copy for a specific whale persona.
 * Automatically selects 2-3 high-ticket triggers based on persona.
 * Validates output against forbidden word list.
 */
export function generateWhaleCopy(persona: WhalePersona): GeneratedCopy {
  // Select triggers based on persona
  const triggerMap: Record<string, string[]> = {
    fund_manager: [
      'Institutional-grade latency',
      'Algorithmic whale tracking',
      'AUM-weighted portfolio signals',
    ],
    quant_analyst: [
      'Exclusive Alpha API',
      'Order block analytics',
      'Sub-millisecond execution intelligence',
    ],
    family_office: [
      'Enterprise-grade radar',
      'Sharpe ratio optimization',
      'Regulatory-compliant signal delivery',
    ],
    prop_trader: [
      'Cross-exchange arbitrage signals',
      'Dark pool activity monitoring',
      'Unfair market advantage',
    ],
    crypto_whale: [
      'Whale wallet surveillance',
      'Private institutional channel access',
      'Institutional order flow detection',
    ],
  }

  const triggers = triggerMap[persona.id] || HIGH_TICKET_TRIGGERS.slice(0, 3)

  const headline = `MarktBit — ${triggers[0]} for ${persona.label}s`
  const subheadline = persona.hook_angle
  const body = `${triggers[1]}. ${triggers[2]}. Built for desks managing serious AUM, not retail portfolios. Request institutional access.`
  const cta = 'Request Enterprise Demo →'

  // Combine all text for validation
  const fullText = `${headline} ${subheadline} ${body} ${cta}`
  const violations = validateCopy(fullText)

  return {
    headline,
    subheadline,
    body,
    cta,
    triggers_used: triggers,
    persona,
    validation_passed: violations.length === 0,
    rejected_words: violations,
  }
}

/**
 * Generate copy for all whale personas at once.
 * Useful for A/B testing across LinkedIn and Twitter campaigns.
 */
export function generateAllWhaleCopy(): GeneratedCopy[] {
  return WHALE_PERSONAS.map((persona) => generateWhaleCopy(persona))
}

/**
 * Generate a LinkedIn-specific ad block (headline + body text)
 * formatted for LinkedIn Sponsored Content specs.
 */
export function generateLinkedInAdBlock(persona: WhalePersona): {
  intro: string
  headline: string
  description: string
  copy: GeneratedCopy
} {
  const copy = generateWhaleCopy(persona)
  return {
    intro: `Sponsored · ${persona.label}s only`,
    headline: copy.headline,
    description: copy.subheadline,
    copy,
  }
}

/**
 * Generate a Twitter/X ad block formatted for promoted posts.
 * Includes hashtag set (institutional only, no retail crypto tags).
 */
export function generateTwitterAdBlock(persona: WhalePersona): {
  tweet: string
  hashtags: string[]
  copy: GeneratedCopy
} {
  const copy = generateWhaleCopy(persona)
  const hashtags = [
    '#InstitutionalTrading',
    '#CryptoAlpha',
    '#QuantTrading',
    '#HedgeFund',
  ]
  const tweet = `${copy.headline}\n\n${copy.subheadline}\n\n${copy.cta}`

  return {
    tweet,
    hashtags,
    copy,
  }
}
