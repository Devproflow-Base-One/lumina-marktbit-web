# LUMINA ACTION PLAN â€” DUBAI READY

**Tanggal:** 22 Juni 2026, 12:15 WIB
**Berdasarkan:** Audit 170 Dimensi (Score: 5.65/10)
**Prioritas User:** International licensing TERAKHIR dikerjakan

---

## PRIORITAS REORDERED (User Request)

```
Phase 1: Code-Level Improvements (Bisa dikerjakan SEKARANG)
Phase 2: Ecosystem Integration
Phase 3: Licensing & Commercial (Code-level)
Phase 4: Lumina Core Dubai Readiness (Code-level)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
Phase 5: International Standards & Dubai Legal (TERAKHIR)
         (Requires external parties: lawyer, RERA, TDRA, banks, DLD)
```

---

## PHASE 1: CODE-LEVEL IMPROVEMENTS (Week 1-4)

### 1.1 API Versioning (Dimensi 62 â€” Score 3/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Add /v1/ prefix to all Overmind routers | `apps/api/main.py` | Change all `prefix="/api/..."` to `prefix="/api/v1/..."` | Low |
| Add /v1/ to Lumina Core API routes | `apps/web/lib/api/` | Add versioning to API client | Medium |
| Add deprecation header | `apps/api/main.py` | Add `Deprecation` header to old routes | Low |
| Create CHANGELOG.md | Root | Create changelog template | Low |

### 1.2 Security Hardening (Dimensi 50, 54, 67 â€” Score 5-7/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Add CSRF protection | `apps/api/main.py` | Add CSRF middleware | Medium |
| Add security headers | `apps/api/main.py` | Add X-Content-Type-Options, X-Frame-Options, HSTS | Low |
| Add refresh token | `apps/api/endpoints/auth.py` | Implement refresh token flow | Medium |
| Add token revocation | `apps/api/endpoints/auth.py` | Add blacklist mechanism | Medium |
| Add HSTS header | `apps/dashboard/middleware.ts` | Add Strict-Transport-Security | Low |

### 1.3 Open Source License Compliance (Dimensi 135 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create LICENSE for Overmind | `lumina-overmind/LICENSE` | Proprietary license | Low |
| Create LICENSE for Lumina Core | `lumina-products [SALE]/lumina-core/LICENSE` | Proprietary license | Low |
| Create LICENSE for AdBlocker | `lumina-products [SALE]/Lumina AdBlocker/LICENSE` | MIT (open source) | Low |
| Create LICENSE for Clean Node | `lumina-products [SALE]/Lumina Clean Node/LICENSE` | MIT (open source) | Low |
| Create LICENSE for 14 AI Extensions | Each extension folder | MIT (open source) | Low |
| Create NOTICE file | Each product | Third-party attributions | Medium |

### 1.4 EULA & Terms of Service (Dimensi 132 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create EULA template for Lumina Core | `lumina-products [SALE]/lumina-core/EULA.md` | Proprietary EULA (jual putus) | Medium |
| Create EULA for AdBlocker | `lumina-products [SALE]/Lumina AdBlocker/EULA.md` | Freemium EULA | Medium |
| Create EULA for Clean Node | `lumina-products [SALE]/Lumina Clean Node/EULA.md` | One-time EULA | Medium |
| Create ToS for Overmind | `lumina-overmind/TERMS_OF_SERVICE.md` | SaaS ToS | Medium |
| Create Privacy Policy template | `lumina-overmind/PRIVACY_POLICY.md` | Privacy policy | Medium |

### 1.5 Git Hygiene & Governance (Dimensi 34, 37, 70, 100 â€” Score 3-6/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create CODEOWNERS | `.github/CODEOWNERS` | Define code ownership | Low |
| Create PR template | `.github/PULL_REQUEST_TEMPLATE.md` | Standard PR format | Low |
| Create Issue templates | `.github/ISSUE_TEMPLATE/` | Bug, feature, security templates | Low |
| Archive lumina-core.v01 | Move to archive | Deprecate old version | Low |
| Clean legacy folders | `lumina_os/`, `app/`, `frontend/` | Remove or archive | Medium |
| Add CONTRIBUTING.md | Root | Contribution guidelines | Low |

### 1.6 Search & Filtering (Dimensi 43 â€” Score 5/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Add full-text search to leads | `apps/api/endpoints/leads.py` | PostgreSQL full-text search | Medium |
| Add multi-field filter | `apps/api/endpoints/leads.py` | Filter by name, phone, status, date | Medium |
| Standardize pagination | All endpoints | Cursor-based pagination | Medium |

### 1.7 Backup & DR (Dimensi 42, 68 â€” Score 4-5/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create backup verification script | `scripts/verify-backup.ps1` | Test restore from backup | Medium |
| Define RTO/RPO | `docs/DR_POLICY.md` | Document recovery objectives | Low |
| Create DR runbook | `docs/DR_RUNBOOK.md` | Step-by-step recovery | Medium |

### 1.8 Calendar & Scheduling (Dimensi 89 â€” Score 4/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create calendar endpoint | `apps/api/endpoints/calendar.py` | CRUD calendar events | Medium |
| Create calendar UI | `apps/dashboard/app/[locale]/calendar/` | Calendar page | Medium |
| Add follow-up reminder | `celery_tasks/notification_tasks.py` | Auto-remind via Celery | Medium |

### 1.9 Email Template Management (Dimensi 86 â€” Score 6/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create email template system | `apps/api/endpoints/email_templates.py` | CRUD templates | Medium |
| Create template renderer | `packages/core_modules/notifications/` | Jinja2 renderer | Medium |
| Add multi-language templates | `templates/email/` | Per-locale templates | Medium |

### 1.10 In-App Messaging (Dimensi 88 â€” Score 5/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create chat endpoint | `apps/api/endpoints/chat.py` | Message CRUD | Medium |
| Create chat UI | `apps/dashboard/components/ChatWidget.tsx` | Chat component | Medium |
| Add message history | `schema.prisma` | Message model | Low |

---

## PHASE 2: ECOSYSTEM INTEGRATION (Week 3-8)

### 2.1 Product â†’ Overmind Telemetry API (Dimensi 92, 93, 110 â€” Score 2-3/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create telemetry endpoint | `apps/api/endpoints/telemetry.py` | Receive product usage data | High |
| Create product SDK | `packages/lumina-sdk/` | JS SDK for products to report | High |
| Add telemetry to AdBlocker | `Lumina AdBlocker/src/background/` | Report install/usage | Medium |
| Add telemetry to Clean Node | `Lumina Clean Node/src/extension.ts` | Report install/usage | Medium |
| Create telemetry dashboard | `apps/dashboard/app/[locale]/ecosystem/` | Ecosystem monitoring page | High |

### 2.2 Cross-Product SSO (Dimensi 120 â€” Score 2/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create SSO endpoint | `apps/api/endpoints/sso.py` | Cross-product auth | High |
| Create shared auth SDK | `packages/lumina-sdk/auth.js` | Shared auth client | High |
| Add SSO to Lumina Core | `lumina-core/apps/web/lib/auth/` | Integrate SSO | High |

### 2.3 Bundle & Cross-Sell System (Dimensi 98, 120, 139 â€” Score 1-3/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create bundle endpoint | `apps/api/endpoints/bundles.py` | Bundle pricing config | Medium |
| Create cross-sell widget | `apps/dashboard/components/CrossSellWidget.tsx` | Recommend products | Medium |
| Add bundle licensing | `apps/api/endpoints/license.py` | Multi-product license | Medium |

### 2.4 Chrome Extension Implementation (Dimensi 91, 96 â€” Score 5/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Implement AI Alt Text Generator | Extension src/ | Full implementation | High |
| Implement AI Bookmark Organizer | Extension src/ | Full implementation | High |
| Implement AI Document Analyzer | Extension src/ | Full implementation | High |
| Implement AI Job Autofill | Extension src/ | Full implementation | High |
| Implement AI Research Assistant | Extension src/ | Full implementation | High |
| Implement AI Writer Multilingual | Extension src/ | Full implementation | High |
| Implement AI Writing Assistant | Extension src/ | Full implementation | High |
| Implement Cookie Consent Blocker | Extension src/ | Full implementation | High |
| Implement Dark Mode AI Reader | Extension src/ | Full implementation | High |
| Implement Focus Pomodoro Blocker | Extension src/ | Full implementation | High |
| Implement Mail AI Assistant | Extension src/ | Full implementation | High |
| Implement Screenshot AI Analyzer | Extension src/ | Full implementation | High |
| Implement SEO Toolbar | Extension src/ | Full implementation | High |
| Implement Tab Session Manager | Extension src/ | Full implementation | High |

### 2.5 Publish Ready Products (Dimensi 109, 119 â€” Score 3/10)

| Task | Product | Action | Effort |
|------|---------|--------|--------|
| Publish AdBlocker | Chrome Web Store | Package + submit | Low |
| Publish Clean Node | VS Code Marketplace | Package + submit | Low |

---

## PHASE 3: LICENSING & COMMERCIAL (Week 4-10)

### 3.1 License Key System for Lumina Core (Dimensi 131 â€” Score 4/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create license key format | `packages/core_modules/licensing/` | LUM-XXXX-XXXX-XXXX format | Medium |
| Create license generation | `apps/api/endpoints/license.py` | Generate perpetual licenses | High |
| Create license validation client | `lumina-core/apps/web/lib/license/` | Client-side validation | High |
| Add device binding | `packages/core_modules/licensing/` | Fingerprint-based | High |
| Create license activation flow | `lumina-core/apps/web/app/activate/` | Activation page | Medium |

### 3.2 DRM & License Enforcement (Dimensi 134 â€” Score 2/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Server-side validation | `apps/api/endpoints/license.py` | Online validation | Medium |
| Offline grace period | `packages/core_modules/licensing/` | 7-day offline grace | Medium |
| Integrity check | `packages/core_modules/licensing/` | Code signing | High |
| Anti-tamper | `packages/core_modules/licensing/` | Tamper detection | High |

### 3.3 Payment Gateway & Billing (Dimensi 98, 133 â€” Score 2-3/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Integrate Stripe | `apps/api/endpoints/payments.py` | Stripe Checkout + Webhooks | High |
| Create billing system | `apps/api/endpoints/billing.py` | Subscription management | High |
| Create pricing tiers | `apps/api/endpoints/pricing.py` | Tier config per product | Medium |
| Create invoice generator | `apps/api/endpoints/invoices.py` | PDF invoice generation | Medium |
| Add Lumina Core purchase flow | `lumina-core/apps/web/app/checkout/` | Checkout page | High |

### 3.4 Trial & Freemium (Dimensi 137 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create trial config | `packages/core_modules/licensing/` | 14-day trial config | Medium |
| Create trial enforcement | `apps/api/endpoints/license.py` | Trial expiry check | Medium |
| Create trial conversion email | `celery_tasks/notification_tasks.py` | Auto email before expiry | Low |
| Create trial abuse prevention | `apps/api/endpoints/license.py` | IP + device fingerprint | Medium |

### 3.5 License Revocation (Dimensi 138 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create revocation endpoint | `apps/api/endpoints/license.py` | Revoke license | Medium |
| Create blacklist system | `packages/core_modules/licensing/` | Blacklist DB | Medium |
| Add refund â†’ auto-revoke | `apps/api/endpoints/payments.py` | Webhook handler | Medium |
| Add fraud â†’ auto-revoke | `apps/api/endpoints/license.py` | Fraud detection | High |

### 3.6 Territory-Based Licensing (Dimensi 141 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create territory config | `packages/core_modules/licensing/` | Region-based rules | Medium |
| Add geoblock mechanism | `apps/api/endpoints/license.py` | IP geolocation check | Medium |
| Create region-based pricing | `apps/api/endpoints/pricing.py` | Price per region | Medium |

### 3.7 Reseller & Affiliate Tier (Dimensi 136 â€” Score 4/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create reseller tiers | `apps/api/endpoints/reseller.py` | Silver/Gold/Platinum | Medium |
| Create reseller agreement template | `docs/legal/RESELLER_AGREEMENT.md` | Legal template | Medium |
| Add commission tracking | `apps/api/endpoints/reseller.py` | Commission calc | Medium |

### 3.8 White-Label Licensing (Dimensi 142 â€” Score 3/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Add white-label license tier | `apps/api/endpoints/license.py` | White-label flag | Medium |
| Add custom domain support | `apps/dashboard/middleware.ts` | Domain routing | High |
| Add theme customization | `apps/dashboard/lib/theme.ts` | Custom theme per tenant | Medium |

### 3.9 Revenue Recognition (Dimensi 147 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create revenue recognition engine | `packages/core_modules/finance/` | IFRS 15 logic | High |
| Add deferred revenue | `schema.prisma` | DeferredRevenue model | Medium |
| Create revenue report | `apps/api/endpoints/finance.py` | Revenue report endpoint | Medium |

### 3.10 SBOM & Supply Chain (Dimensi 150 â€” Score 4/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Add SBOM generation | `scripts/generate-sbom.ps1` | Generate SBOM from lock files | Medium |
| Add dependency scan to CI | `.github/workflows/ci-cd.yml` | Add Trivy to all products | Low |
| Create supply chain policy | `docs/SUPPLY_CHAIN_POLICY.md` | Policy document | Low |

---

## PHASE 4: LUMINA CORE DUBAI READINESS (Week 6-14)

### 4.1 Multi-Currency Property Pricing (Dimensi 170 â€” Score 3/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Add currency field to properti table | `supabase/schema.sql` | Add `currency VARCHAR(3) DEFAULT 'IDR'` | Low |
| Create migration | `supabase/017_add_currency_field.sql` | Migration script | Low |
| Add currency to property UI | `apps/web/components/property/` | Currency selector | Medium |
| Add currency conversion | `apps/web/lib/currency/` | Real-time conversion | Medium |

### 4.2 On-Premise Deployment (Dimensi 162 â€” Score 4/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create on-premise Docker config | `docker/docker-compose.onpremise.yml` | Self-hosted config | Medium |
| Create offline mode | `lumina-core/apps/web/lib/offline/` | Offline capability | High |
| Create UAE data residency config | `docs/UAE_DATA_RESIDENCY.md` | Config guide | Low |
| Create on-premise install guide | `docs/ON_PREMISE_INSTALL.md` | Step-by-step | Medium |

### 4.3 Implementation & Training (Dimensi 163 â€” Score 4/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create training material | `docs/training/` | Admin + user training | Medium |
| Create onboarding timeline | `docs/ONBOARDING_TIMELINE.md` | 30-60-90 day plan | Low |
| Create success metrics | `docs/SUCCESS_METRICS.md` | KPI tracking | Low |

### 4.4 Custom Development Process (Dimensi 164 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create custom dev process | `docs/CUSTOM_DEV_PROCESS.md` | Process document | Low |
| Create feature request template | `.github/ISSUE_TEMPLATE/feature-request.md` | Template | Low |
| Create custom SLA template | `docs/legal/SLA_TEMPLATE.md` | SLA document | Medium |

### 4.5 Islamic Finance Module (Dimensi 158 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create Murabahah CRM model | `supabase/018_islamic_finance.sql` | Murabahah tables | High |
| Create Ijarah model | `supabase/018_islamic_finance.sql` | Ijarah (lease) tables | High |
| Create no-riba mode | `lumina-core/apps/web/lib/finance/` | Islamic finance mode | High |
| Create Sharia compliance check | `lumina-core/apps/web/lib/sharia/` | Compliance validator | High |
| Add Islamic finance UI | `lumina-core/apps/web/components/finance/` | Murabahah calculator | Medium |

### 4.6 UAE Bank Integration Framework (Dimensi 167 â€” Score 2/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create bank API abstraction | `lumina-core/apps/web/lib/bank-api/` | Abstract bank interface | High |
| Create Emirates NBD integration | `lumina-core/apps/web/lib/bank-api/emirates_nbd.ts` | API client | High |
| Create ADCB integration | `lumina-core/apps/web/lib/bank-api/adcb.ts` | API client | High |
| Create Dubai Islamic Bank integration | `lumina-core/apps/web/lib/bank-api/dib.ts` | API client | High |

### 4.7 DLD Integration Framework (Dimensi 169 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create DLD API client | `lumina-core/apps/web/lib/dld/` | DLD API integration | High |
| Create Oqood registration | `lumina-core/apps/web/lib/dld/oqood.ts` | Off-plan registration | High |
| Create title deed management | `lumina-core/apps/web/lib/dld/title_deed.ts` | Title deed tracking | Medium |

### 4.8 UAE Notary Integration (Dimensi 168 â€” Score 2/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create notary API abstraction | `lumina-core/apps/web/lib/notary/` | Abstract notary interface | Medium |
| Create Dubai Courts integration | `lumina-core/apps/web/lib/notary/dubai_courts.ts` | API client | High |

### 4.9 Source Code Escrow (Dimensi 161 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create escrow agreement template | `docs/legal/ESCROW_AGREEMENT.md` | Legal template | Medium |
| Create code packaging script | `scripts/package-escrow.ps1` | Package source for deposit | Low |
| Create release conditions doc | `docs/legal/ESCROW_RELEASE_CONDITIONS.md` | Release triggers | Low |

### 4.10 Arabic Legal Documents (Dimensi 165 â€” Score 1/10)

| Task | File | Action | Effort |
|------|------|--------|--------|
| Create Arabic MSA | `docs/legal/MSA_AR.md` | Arabic MSA | Medium |
| Create Arabic DPA | `docs/legal/DPA_AR.md` | Arabic DPA | Medium |
| Create Arabic EULA | `docs/legal/EULA_AR.md` | Arabic EULA | Medium |
| Create Arabic SLA | `docs/legal/SLA_AR.md` | Arabic SLA | Medium |
| Create bilingual MSA | `docs/legal/MSA_BILINGUAL.md` | Arabic + English | Medium |

---

## PHASE 5: INTERNATIONAL STANDARDS & DUBAI LEGAL (TERAKHIR â€” Month 3-12)

> **Catatan:** Phase ini requires external parties (lawyer, auditor, RERA, TDRA, banks, DLD)
> **Tidak bisa dikerjakan oleh code alone â€” requires business decisions dan external registrations**

### 5.1 ISO 27001 (Dimensi 151 â€” Score 3/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Gap assessment | Security consultant | 2-4 weeks |
| Risk register | Internal | 2 weeks |
| Incident response plan | Internal | 2 weeks |
| BCP/DRP | Internal | 4 weeks |
| Statement of Applicability | Consultant | 2 weeks |
| Internal audit | Internal | 2 weeks |
| Certification audit | ISO auditor | 4-8 weeks |
| **Total** | | **3-6 months** |

### 5.2 SOC 2 Type II (Dimensi 152 â€” Score 3/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Trust principles mapping | Internal | 2 weeks |
| Control implementation | Internal | 2-3 months |
| Audit evidence collection | Internal | 1-2 months |
| Continuous monitoring setup | Internal | 1 month |
| SOC 2 audit | CPA firm | 2-3 months |
| **Total** | | **6-12 months** |

### 5.3 PCI DSS (Dimensi 153 â€” Score 2/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Use Stripe (tokenization) | Developer | 1-2 weeks |
| SAQ-A completion | Internal | 1 week |
| Quarterly scan | ASV | Ongoing |
| **Total** | | **1 month** |

### 5.4 ISO 22301 (Dimensi 154 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Business impact analysis | Internal | 2 weeks |
| BCP document | Internal | 2 weeks |
| DRP document | Internal | 2 weeks |
| Testing & exercise | Internal | 1 month |
| Certification | Auditor | 2-4 weeks |
| **Total** | | **2-3 months** |

### 5.5 UAE PDPL (Dimensi 156 â€” Score 2/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Appoint DPO | Management | 1 week |
| Data mapping | Internal | 2 weeks |
| Consent management | Developer | 2 weeks |
| Data localization | DevOps | 1-2 months |
| Breach notification process | Internal | 1 week |
| UAE-specific privacy notice | Lawyer | 2 weeks |
| **Total** | | **2-3 months** |

### 5.6 TDRA Registration (Dimensi 157 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Product classification | Internal | 1 week |
| Compliance declaration | Lawyer | 2 weeks |
| Local representative | Management | 1 week |
| Submit registration | TDRA | 4-8 weeks |
| **Total** | | **1-2 months** |

### 5.7 Islamic Finance & Sharia (Dimensi 158 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Sharia board appointment | Management | 1-2 months |
| Murabahah certification | Sharia scholar | 2-3 months |
| Ijarah certification | Sharia scholar | 1-2 months |
| Sharia audit | Sharia auditor | 1 month |
| **Total** | | **3-6 months** |

### 5.8 Multi-Jurisdiction Tax (Dimensi 159 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Tax engine implementation | Developer | 2-4 weeks |
| UAE VAT 5% config | Developer | 1 week |
| Indonesia PPN 11% config | Developer | 1 week |
| EU VAT config | Developer | 1 week |
| Tax advisor consultation | Tax advisor | 2 weeks |
| **Total** | | **1-2 months** |

### 5.9 Export Control & Sanctions (Dimensi 160 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| Sanctions screening system | Developer | 2-4 weeks |
| UAE sanctioned list integration | Developer | 1 week |
| US OFAC screening | Developer | 1 week |
| Compliance officer | Management | 1 week |
| **Total** | | **1-2 months** |

### 5.10 RERA Dubai (Dimensi 166 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| RERA registration | Management | 1-2 months |
| Ejari integration | Developer | 2-4 weeks |
| Trakheesi integration | Developer | 2-4 weeks |
| RERA compliance officer | Management | 1 week |
| **Total** | | **2-3 months** |

### 5.11 Trademark & IP (Dimensi 149 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| UAE trademark registration | IP lawyer | 1-2 months |
| WIPO international trademark | IP lawyer | 2-4 months |
| Copyright notices | Developer | 1 day |
| IP assignment agreements | Lawyer | 2 weeks |
| **Total** | | **2-4 months** |

### 5.12 DPA & Privacy Licensing (Dimensi 148 â€” Score 1/10)

| Task | Owner | Timeline |
|------|-------|----------|
| DPA template | Lawyer | 2 weeks |
| Sub-processor list | Internal | 1 week |
| Breach notification process | Internal | 1 week |
| Data deletion on termination | Developer | 1 week |
| **Total** | | **2-4 weeks** |

---

## TIMELINE SUMMARY

```
Phase 1: Code-Level (Week 1-4)          â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  Code only
Phase 2: Ecosystem Integration (Week 3-8)  â–‘â–‘â–‘â–‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  Code + publish
Phase 3: Licensing & Commercial (Week 4-10) â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘  Code + Stripe
Phase 4: Core Dubai Code (Week 6-14)    â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘  Code + frameworks
Phase 5: International & Legal (Month 3-12) â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–ˆâ–ˆâ–ˆâ–ˆ  External parties
                                          â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                                          W1  W4  W8  W14  M6  M12
```

## EFFORT ESTIMATE

| Phase | Tasks | Effort | Dependencies |
|-------|-------|--------|-------------|
| Phase 1 | 30+ | Medium | None |
| Phase 2 | 20+ | High | Phase 1 (partial) |
| Phase 3 | 25+ | High | Phase 1 (partial) |
| Phase 4 | 20+ | High | Phase 3 (partial) |
| Phase 5 | 30+ | Very High | External parties |
| **Total** | **125+** | **Very High** | |

---

*Action plan dibuat oleh Cascade AI pada 22 Juni 2026*
*Berdasarkan audit 170 dimensi*
*Prioritas: international licensing TERAKHIR sesuai user request*
