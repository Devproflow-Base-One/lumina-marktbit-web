# LUMINA OVERMIND — COMPLETION PLAN

**Dibuat:** 22 Juni 2026, 13:31 WIB
**Updated:** 22 Juni 2026, 13:57 WIB
**Berdasarkan:** Analisa codebase mendalam (273 TODO/FIXME across 47 files + mock data audit + i18n audit + deployment audit + env config audit)

---

## STATUS SAAT INI

### ✅ Selesai
- Phase 1: Code-Level Improvements (10 sub-tasks)
- Phase 2: Ecosystem Integration (8 sub-tasks)
- Phase 3: License Manager & DRM (13 endpoints)
- Phase 4: Dubai Readiness active items (4.1, 4.2, 4.3, 4.4, 4.7, 4.9)
- 38 API routers terdaftar (±367 endpoints)
- 20 dashboard pages
- 52 new endpoints dari Phase 1-3

### ⏸️ Deferred (per user request — skip dulu)
- Phase 4.5: Islamic Finance TS Library
- Phase 4.6: UAE Bank Integration Framework
- Phase 4.8: UAE Notary Integration
- Phase 4.10: Arabic Legal Documents
- Phase 5: International Standards & Legal (external parties)

---

## TRACK 1: FIX MOCK/PLACEHOLDER ENDPOINTS (HIGH PRIORITY — 14 files)

| # | File | Issue | Action |
|---|------|-------|--------|
| 1.1 | `endpoints/pdp_compliance.py` | 7 TODO: consent store/retrieval, deletion request, data export, breach report — semua return mock | Implementasi dengan database/in-memory store |
| 1.2 | `endpoints/cross_border_compliance.py` | 3 TODO: transfer log store, retrieval, get by ID — return empty | Implementasi transfer log storage |
| 1.3 | `endpoints/leads_integration.py` | 1 TODO: returns empty `[]` — DEVFLO integration tidak berfungsi | Connect ke leads database |
| 1.4 | `endpoints/license.py` | 2 TODO: usage stats (mock), save license key | Implementasi real usage tracking |
| 1.5 | `endpoints/DEVFLO_life_data.py` | 1 TODO: phone number lookup returns `None` | Connect ke user database |
| 1.6 | `endpoints/cost_monitoring.py` | **Seluruh file mock** — `MOCK_COST_DATA` dict, semua perhitungan pakai mock, budget forecasting mock | Implementasi real cost calculation dari cloud provider API |
| 1.7 | `endpoints/policy_engine.py` | **Seluruh file mock** — `POLICY_DEFINITIONS` hardcoded, `POLICY_VIOLATIONS = []`, evaluation pakai `random.random()` | Implementasi real policy definitions dari database, real evaluation logic |
| 1.8 | `endpoints/data_privacy.py` | **3 mock arrays** — `DATA_ACCESS_LOGS = []`, `DATA_BREACH_ALERTS = []`, purge "assume 10 records" | Implementasi real data access logging, breach tracking, purge logic |
| 1.9 | `endpoints/cross_border_data.py` | 2 TODO: compliance check always returns `'compliant'`, encryption is mock | Implementasi real compliance check dan encryption |
| 1.10 | `endpoints/projects.py` | 1 TODO: `get_project_stats` returns hardcoded mock numbers | Query real stats dari database |
| 1.11 | `endpoints/vr.py` | 1 TODO: session data returns mock `user_123` | Query real session dari database |
| 1.12 | `endpoints/telegram_webhook.py` | 4 mock functions: daily stats, market scan, backup, stop operations | Implementasi real database queries |
| 1.13 | `endpoints/system_control.py` | 2 mock functions: `_get_queries_count` returns 892, `_get_success_rate` returns 94.5 | Implementasi real metrics |
| 1.14 | `endpoints/cloud_cost_optimization.py` | 8 TODO: cost analysis mock | Implementasi real cost calculation |

**Estimasi: 14 files, High priority**

---

## TRACK 2: TESTING (HIGH PRIORITY — 21 files)

### 2A. Backend API Tests (10 files)
| # | Test File | Endpoint | Coverage |
|---|-----------|----------|---------|
| 2.1 | `test_auth_refresh.py` | auth.py refresh token | Token refresh, revocation |
| 2.2 | `test_telemetry.py` | telemetry.py | Event tracking, batch, dashboard |
| 2.3 | `test_sso.py` | sso.py | Login, exchange, logout |
| 2.4 | `test_bundles.py` | bundles.py | CRUD, cross-sell, purchase |
| 2.5 | `test_license_manager.py` | license_manager.py | Generate, validate, activate, trial |
| 2.6 | `test_calendar.py` | calendar.py | CRUD events |
| 2.7 | `test_email_templates.py` | email_templates.py | CRUD, render |
| 2.8 | `test_compliance.py` | compliance.py | PDP, cross-border |
| 2.9 | `test_payments.py` | payments.py | Payment flow |
| 2.10 | `test_ecosystem_integration.py` | telemetry + sso + bundles | Integration test |

### 2B. Frontend Component Tests (8 files)
| # | Test File | Component |
|---|-----------|-----------|
| 2.11 | `leads-page.test.tsx` | Leads page CRUD |
| 2.12 | `projects-page.test.tsx` | Projects page |
| 2.13 | `dashboard.test.tsx` | Main dashboard |
| 2.14 | `login.test.tsx` | Login flow |
| 2.15 | `ecosystem-page.test.tsx` | Ecosystem dashboard |
| 2.16 | `settings.test.tsx` | Settings page |
| 2.17 | `inbox.test.tsx` | Inbox/messaging |
| 2.18 | `campaigns.test.tsx` | Campaigns page |

### 2C. E2E Tests (3 files)
| # | Test File | Flow |
|---|-----------|------|
| 2.19 | `login-flow.spec.ts` | Login → dashboard → logout |
| 2.20 | `lead-crud.spec.ts` | Create → read → update → delete lead |
| 2.21 | `project-crud.spec.ts` | Create → read → update → delete project |

**Current state:** 5 backend tests, 6 frontend tests, 1 E2E test
**Estimasi: 21 new files, High priority**

---

## TRACK 3: I18N — 20 LOCALE FILES MISSING (HIGH PRIORITY — 21 files)

### Problem
`i18n.ts` hanya mendefinisikan 2 locale: `['en', 'id']`
Hanya ada 2 message files: `en.json` dan `id.json`
Blueprint menyebut 22 locale support tapi **20 locale tidak ada implementasinya**

### 3A. Update i18n config (1 file)
| # | File | Action |
|---|------|--------|
| 3.1 | `i18n.ts` | Update `locales` array dari 2 ke 22 locale |

### 3B. Create 20 missing locale files (20 files)
| # | File | Locale | Priority |
|---|------|--------|----------|
| 3.2 | `messages/ar.json` | Arabic | **Critical** (Dubai readiness) |
| 3.3 | `messages/fa.json` | Persian | High |
| 3.4 | `messages/zh.json` | Chinese | Medium |
| 3.5 | `messages/ja.json` | Japanese | Medium |
| 3.6 | `messages/ko.json` | Korean | Medium |
| 3.7 | `messages/es.json` | Spanish | Medium |
| 3.8 | `messages/fr.json` | French | Medium |
| 3.9 | `messages/de.json` | German | Medium |
| 3.10 | `messages/pt.json` | Portuguese | Medium |
| 3.11 | `messages/ru.json` | Russian | Medium |
| 3.12 | `messages/tr.json` | Turkish | Medium |
| 3.13 | `messages/hi.json` | Hindi | Medium |
| 3.14 | `messages/th.json` | Thai | Medium |
| 3.15 | `messages/vi.json` | Vietnamese | Medium |
| 3.16 | `messages/ms.json` | Malay | Medium |
| 3.17 | `messages/nl.json` | Dutch | Low |
| 3.18 | `messages/it.json` | Italian | Low |
| 3.19 | `messages/pl.json` | Polish | Low |
| 3.20 | `messages/sv.json` | Swedish | Low |
| 3.21 | `messages/he.json` | Hebrew | Low |

### 3C. RTL Support (1 file)
| # | File | Action |
|---|------|--------|
| 3.22 | `lib/rtl-utils.ts` | Verify & enhance RTL layout untuk Arabic, Persian, Hebrew |

**Estimasi: 21 files, High priority (Arabic critical untuk Dubai)**

---

## TRACK 4: DEPLOYMENT & DEV ENVIRONMENT (MEDIUM PRIORITY — 2 files)

### Yang Sudah Ada ✅
- **PM2 `ecosystem.config.js`** — 4 process: lumina-api (:8000), lumina-dashboard (:3000), lumina-celery-worker, lumina-celery-beat
- **Supabase PostgreSQL** — cloud free tier, project `spabxhujvypmueiiuves`, region `ap-southeast-1` (Singapore), port 6543 (PgBouncer)
- **Sentry** — code integrasi sudah ada (`monitoring/sentry.py`), butuh `SENTRY_DSN` env var
- **CI/CD** — `.github/workflows/ci-cd.yml` deploy ke Vercel (dashboard) + Cloud Run (API)
- **Tidak pakai Docker** — PM2 untuk local dev, cloud deploy untuk production

### Yang Perlu Dikerjakan

| # | File | Action | Keterangan |
|---|------|--------|------------|
| 4.1 | `.env.example` | Create template environment variables | Dokumentasi semua env vars: `DATABASE_URL`, `REDIS_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SENTRY_DSN`, dll |
| 4.2 | `endpoints/health.py` | Fix Redis health check hardcoded | Ganti `localhost:6379` + hardcoded password ke `os.getenv("REDIS_URL")` |

### Arsitektur Deployment

```
LOCAL DEV (Windows + PM2):
  lumina-api (:8000) ────▶ Supabase PostgreSQL (cloud)
  lumina-dashboard (:3000) ──▶ Supabase PostgreSQL (cloud)
  lumina-celery-worker ───▶ Redis (cloud)
  lumina-celery-beat ────▶ Redis (cloud)

PRODUCTION (Cloud):
  Vercel (Dashboard) ─────▶ Cloud Run (API) ──▶ Supabase PostgreSQL
                                              ──▶ Redis (cloud)
  Cloud Run Jobs (Celery) ─▶ Supabase PostgreSQL
                          ──▶ Redis (cloud)
```

**Estimasi: 2 files, Medium priority**

---

## TRACK 5: UI/UX POLISH (MEDIUM PRIORITY — 10+ files)

| # | Item | Action | Files |
|---|------|--------|-------|
| 5.1 | Light theme | Add theme toggle + light mode styles | `theme-provider.tsx`, `globals.css`, multiple pages |
| 5.2 | Loading states | Add Skeleton components to pages missing them | 5-8 pages |
| 5.3 | Empty states | Add empty state UI for pages with no data | 5-8 pages |
| 5.4 | Mobile responsive | Audit & fix responsive issues on all 20 pages | 10+ pages |
| 5.5 | Error boundaries | Add per-page ErrorBoundary wrappers | layout files |
| 5.6 | Toast notifications | Standardize toast usage across pages | 5+ pages |

**Estimasi: 10+ files, Medium priority**

---

## TRACK 6: VISUAL/RENDER FIXES (MEDIUM PRIORITY — 3 files)

| # | File | Issue | Action |
|---|------|-------|--------|
| 6.1 | `endpoints/visual_mirage.py` | 3 TODO: Stable Diffusion placeholder URL, render fallback | Implementasi real SD API atau remove placeholder |
| 6.2 | `endpoints/webhooks.py` | 2 TODO: VFX processing tidak auto-trigger | Enable auto-trigger |
| 6.3 | `endpoints/legal_sovereign.py` | 1 TODO: KTP extraction pakai fallback, bukan OCR | Integrate proper OCR (Tesseract atau cloud OCR) |

**Estimasi: 3 files, Medium priority**

---

## TRACK 7: CI/CD & SECURITY (LOW-MEDIUM PRIORITY — 3 files)

| # | Issue | Action | File |
|---|-------|--------|------|
| 7.1 | CI/CD deploy API ke Cloud Run tanpa Dockerfile | Update CI/CD untuk source-based deploy (`gcloud run deploy --source`) | `.github/workflows/ci-cd.yml` |
| 7.2 | SBOM generation tidak ada | Add SBOM generation script | `scripts/generate-sbom.ps1` |
| 7.3 | Dependency scan tanpa fail threshold | Add Trivy fail threshold ke CI/CD | `.github/workflows/ci-cd.yml` |

**Estimasi: 3 files, Low-Medium priority**

---

## TRACK 9: CLOUD INFRASTRUCTURE FIXES (MEDIUM PRIORITY — 4 files)

### Yang Sudah Ada ✅
- Supabase PostgreSQL cloud — terhubung
- PM2 ecosystem config — 4 process
- Sentry code — ada, butuh DSN
- CI/CD workflow — ada

### Yang Perlu Dikerjakan

| # | Issue | Action | File |
|---|-------|--------|------|
| 9.1 | Redis masih fallback `localhost:6379` | Set `REDIS_URL` ke Upstash cloud di env var | `.env` (user set), `.env.example` (template) |
| 9.2 | Auth token blacklist & CSRF in-memory | Pindah ke Redis (supaya survive restart) | `endpoints/auth.py:44-48` |
| 9.3 | Supabase URL hardcoded di `db_abstraction.py` | Hapus hardcoded fallback, pakai env var saja | `packages/core_modules/db_abstraction.py:22` |
| 9.4 | Sentry butuh `SENTRY_DSN` | Set env var + verify Sentry init | `.env` (user set), `monitoring/sentry.py` (verify) |

**Estimasi: 4 files, Medium priority**

---

## TRACK 8: CODE CLEANUP (LOW PRIORITY — 5 files)

| # | Item | Action | File |
|---|------|--------|------|
| 8.1 | `DEVFLOAssistant.tsx` | Fix hardcoded `project_type: 'KOMERSIL'` | `components/DEVFLOAssistant.tsx` |
| 8.2 | `freelance-revenue/page.tsx` | 14 TODO placeholder features | `app/[locale]/DEVFLO/freelance-revenue/page.tsx` |
| 8.3 | Scraper scripts | 140+ TODO across 4 Python scripts | `scripts/*.py` |
| 8.4 | `tactical_ops.py` | Hardcoded FOMO messages (by design, dokumentasi) | `endpoints/tactical_ops.py` |
| 8.5 | Dead code/unused imports | Audit dan cleanup | Multiple files |

**Estimasi: 5 files, Low priority**

---

## EXECUTION ORDER

```
Track 1 (Fix Mock Endpoints)       ────  HIGH,      14 files
Track 2 (Testing)                  ────  HIGH,      21 files
Track 3 (I18n — 20 locale)         ────  HIGH,      21 files
Track 4 (Deployment & Dev Env)     ────  MEDIUM,     2 files
Track 5 (UI/UX Polish)             ────  MEDIUM,    10+ files
Track 6 (Visual/Render Fixes)      ────  MEDIUM,     3 files
Track 7 (CI/CD & Security)         ────  LOW-MED,    3 files
Track 8 (Code Cleanup)             ────  LOW,        5 files
Track 9 (Cloud Infrastructure)     ────  MEDIUM,     4 files
```

**Total estimasi: ~83 files to create/modify**

---

## PROGRESS TRACKING

| Track | Status | Files Done | Files Total |
|-------|--------|------------|-------------|
| Track 1 | NOT STARTED | 0 | 14 |
| Track 2 | NOT STARTED | 0 | 21 |
| Track 3 | NOT STARTED | 0 | 21 |
| Track 4 | NOT STARTED | 0 | 2 |
| Track 5 | NOT STARTED | 0 | 10+ |
| Track 6 | NOT STARTED | 0 | 3 |
| Track 7 | NOT STARTED | 0 | 3 |
| Track 8 | NOT STARTED | 0 | 5 |
| Track 9 | NOT STARTED | 0 | 4 |
| **TOTAL** | | **0** | **~83** |

---

## CHANGES FROM PREVIOUS VERSION

| Item | Before | After |
|------|--------|-------|
| Track 1 (Mock endpoints) | 6 files | **14 files** (policy_engine, data_privacy, cross_border_data, vr, telegram_webhook, system_control, projects, cost_monitoring baru teridentifikasi) |
| Track 3 (I18n) | Tidak ada | **NEW: 21 files** (20 locale missing + RTL) |
| Track 4 (Deployment) | Docker (3 files) | **PM2 + Cloud (2 files)** — PM2 sudah ada, Supabase sudah connect, tinggal `.env.example` + health fix |
| Track 7 (CI/CD) | Tidak ada | **NEW: 3 files** (CI/CD update, SBOM, Trivy threshold) |
| Track 8 (Code Cleanup) | 5 files (was Track 6) | Sama, renumbered |
| Track 9 (Cloud Infra) | Tidak ada | **NEW: 4 files** (Redis cloud, auth→Redis, hardcoded URL fix, Sentry DSN) |
| Total files | ~50 | **~83** |
