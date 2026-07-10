/**
 * Tech Stack Decision Table
 * F2c: Documented tech stack choices for MarktBit
 *
 * | Layer          | Technology              | Version  | Status   | Rationale                              |
 * |----------------|-------------------------|----------|----------|----------------------------------------|
 * | Framework      | Next.js                 | 14.2+    | Active   | App Router, SSR, i18n, API routes      |
 * | Language       | TypeScript              | 5.x      | Active   | Type safety, strict mode enabled       |
 * | Styling        | Tailwind CSS            | 3.x      | Active   | Utility-first, design tokens           |
 * | UI Components  | Radix UI                | latest   | Active   | Accessible primitives                  |
 * | Icons          | Lucide React            | latest   | Active   | Consistent icon set                    |
 * | i18n           | next-intl               | latest   | Active   | en, id, ar + RTL support               |
 * | State (client) | Zustand                 | latest   | Active   | Lightweight, no boilerplate            |
 * | State (server) | React Query (TanStack)  | latest   | Active   | Server state, caching, mutations       |
 * | Database       | Supabase (PostgreSQL)   | -        | Planned  | RLS, Auth, Realtime, Storage           |
 * | Auth           | Supabase Auth           | -        | Planned  | JWT, OAuth, magic link                 |
 * | Cache          | Upstash Redis           | -        | Planned  | Serverless Redis, rate limiting        |
 * | Payments       | Stripe + NowPayments    | -        | Planned  | Fiat + crypto payments                 |
 * | Analytics      | PostHog                 | latest   | Active   | Product analytics, feature flags       |
 * | Error Tracking | Sentry                  | -        | Planned  | Error monitoring, performance          |
 * | Email          | Resend                  | latest   | Active   | Transactional email                    |
 * | Messaging      | Telegram Bot API        | -        | Active   | Signal alerts, notifications           |
 * | File Storage   | Cloudflare R2           | -        | Planned  | S3-compatible, zero egress             |
 * | Signal Engine  | Node.js (custom)        | -        | Active   | Crypto + stock signals                 |
 * | God Mode       | Node.js (custom)        | -        | Active   | Market analysis, campaigns, ads        |
 * | Deploy (web)   | Vercel                  | -        | Active   | Next.js native, edge functions         |
 * | Deploy (API)   | Contabo VPS             | -        | Planned  | Docker, Nginx, full control            |
 * | CI/CD          | GitHub Actions          | -        | Planned  | Automated build, test, deploy          |
 * | Testing        | Vitest + Playwright     | -        | Active   | Unit + E2E testing                     |
 * | Linting        | ESLint + Prettier       | latest   | Active   | Code quality, formatting               |
 * | Package Mgr    | pnpm                    | latest   | Active   | Monorepo, workspace support            |
 */

export const TECH_STACK = {
  framework: { name: 'Next.js', version: '14.2+', status: 'active' as const },
  language: { name: 'TypeScript', version: '5.x', status: 'active' as const },
  styling: { name: 'Tailwind CSS', version: '3.x', status: 'active' as const },
  uiComponents: { name: 'Radix UI', version: 'latest', status: 'active' as const },
  icons: { name: 'Lucide React', version: 'latest', status: 'active' as const },
  i18n: { name: 'next-intl', version: 'latest', status: 'active' as const },
  stateClient: { name: 'Zustand', version: 'latest', status: 'active' as const },
  stateServer: { name: 'React Query (TanStack)', version: 'latest', status: 'active' as const },
  database: { name: 'Supabase (PostgreSQL)', version: '-', status: 'planned' as const },
  auth: { name: 'Supabase Auth', version: '-', status: 'planned' as const },
  cache: { name: 'Upstash Redis', version: '-', status: 'planned' as const },
  payments: { name: 'Stripe + NowPayments', version: '-', status: 'planned' as const },
  analytics: { name: 'PostHog', version: 'latest', status: 'active' as const },
  errorTracking: { name: 'Sentry', version: '-', status: 'planned' as const },
  email: { name: 'Resend', version: 'latest', status: 'active' as const },
  messaging: { name: 'Telegram Bot API', version: '-', status: 'active' as const },
  fileStorage: { name: 'Cloudflare R2', version: '-', status: 'planned' as const },
  signalEngine: { name: 'Node.js (custom)', version: '-', status: 'active' as const },
  godMode: { name: 'Node.js (custom)', version: '-', status: 'active' as const },
  deployWeb: { name: 'Vercel', version: '-', status: 'active' as const },
  deployApi: { name: 'Contabo VPS', version: '-', status: 'planned' as const },
  ciCd: { name: 'GitHub Actions', version: '-', status: 'planned' as const },
  testing: { name: 'Vitest + Playwright', version: '-', status: 'active' as const },
  linting: { name: 'ESLint + Prettier', version: 'latest', status: 'active' as const },
  packageManager: { name: 'pnpm', version: 'latest', status: 'active' as const },
} as const

export type TechStackKey = keyof typeof TECH_STACK
export type TechStackEntry = typeof TECH_STACK[TechStackKey]
export type TechStatus = 'active' | 'planned' | 'deprecated'
