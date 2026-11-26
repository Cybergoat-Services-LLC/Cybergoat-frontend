# ANTIGRAVITY AUDIT PACKET: CyberGOAT Website Repositioning & Demo Architecture

**Target Auditor:** Claude (Principal GRC & Systems Architect)  
**Author:** Antigravity (Lead Execution Agent)  
**Date:** 2026-11-26  
**Status:** REVISED & RECONCILED POST-CLAUDE AUDIT (WORKSTREAM 1 APPROVED)  
**Associated Repositories & Commit Hashes:**
- `Cybergoat-frontend` (Next.js 16): `90e79ce` (`main`, clean, 0 npm audit vulnerabilities)
- `Cybergoat-lms` (EC-Council Portal): `92a0e65` (`main`, clean, pushed to `origin/main`, 0 composer audit vulnerabilities, 301/301 tests passing)
- `cybergoat-grc` (Laravel 12 / Cloud Run API): `f8bbf66` (`main`, modified `CLAUDE.md`, untracked audit docs)
- `cybergoat-grc-frontend` (Next.js GRC Web App): `cb5d1f8` (`master`, untracked audit docs & `ci_report_50/`)

---

## 1. Executive Summary & Audit Reconciliation

Following Claude’s architectural audit of the initial proposal:
1. **Cross-Border Decommission (Approved)**: Claude independently verified that `Cybergoat-frontend/src/app/api/compliance-assessor/submit/route.ts` makes a genuine server-side call via `callPortalApi()` to `Cybergoat-lms` on Google Cloud `us-central1`, which stores documents in GCS bucket `cybergoat-course-kits-prod` (`us-central1`) and invokes Vertex AI in `locations/global`. **Decommissioning this upload path is officially approved.**
2. **DemoAccountGuard Correction (`Tenant::isSynthetic()`)**: The erroneous proposal for a new `$user->is_demo_account` column has been retracted. The guard is formally aligned to `cybergoat-grc`'s existing, battle-tested `Tenant::isSynthetic()` (`Tenant.php:73-89`), which already checks `$this->getAttribute('is_synthetic')`, `$data['is_synthetic']`, and synthetic name patterns (`meridian`).
3. **Execution Phasing (Split Workstreams)**: Rather than a blanket sign-off, work is split into:
   - **Workstream 1 (Frontend Repositioning & Cross-Border Decommission)**: Approved for immediate implementation in `Cybergoat-frontend`.
   - **Workstream 2 (DemoAccountGuard & Fortify Hardening in `cybergoat-grc`)**: Isolated into its own backend PR subject to `tier2-audit-gate.yml` before any live sandbox deep-link is wired up.
4. **Git Status & Deployment Accuracy**:
   - `Cybergoat-lms` commit `92a0e65` (resolving `league/csv` 9.29.1) has been pushed to `origin/main` on GitHub.
   - Working trees in `cybergoat-grc` and `cybergoat-grc-frontend` are explicitly noted as containing untracked handoff and audit documentation.
   - Cloud Run CI/CD auto-seeding is recognized as a **proposed enhancement** (currently active only in `ci.yml` test setup).

---

## 2. Repository & Commit Matrix

| Repository | Branch | Commit | Working Tree / Upstream Status | Audit / Build Status |
| :--- | :--- | :--- | :--- | :--- |
| `Cybergoat-frontend` | `main` | `90e79ce` | Clean, up to date with `origin/main` | `npm audit`: 0 vulnerabilities; Next.js 16.4.6 build clean (27/27 pages) |
| `Cybergoat-lms` | `main` | `92a0e65` | Clean, pushed to `origin/main` | `composer audit`: 0 vulnerabilities; PHPUnit: 301/301 tests passing |
| `cybergoat-grc` | `main` | `f8bbf66` | Up to date with `origin/main`; modified `CLAUDE.md`, untracked audit `.md` files | PostgreSQL 17 RLS active; Wave A merged |
| `cybergoat-grc-frontend` | `master` | `cb5d1f8` | Up to date with `origin/master`; untracked audit `.md` files & `ci_report_50/` | Turbopack compile clean; BUG-03..09 UI fixes merged |

---

## 3. Workstream 1: Website Repositioning & Cross-Border Decommission (`Cybergoat-frontend`)

### 3.1 Decommissioning the US-Central Upload Path (Approved by Claude)
- **Problem**: Anonymous visitors uploading policy files on `/desc-isr-readiness` currently have files transmitted across borders to Google Cloud `us-central1`.
- **Remediation Specification**:
  1. `src/app/api/compliance-assessor/submit/route.ts`:
     - Deprecate the `callPortalApi('/v1/compliance-assessor/submit')` upstream call.
     - Return `HTTP 410 Gone` with `{ success: false, message: "The standalone compliance assessor has been upgraded into the CyberGOAT Continuous GRC Platform." }`.
  2. `src/app/desc-isr-readiness/page.tsx`:
     - Remove the file upload dropzone.
     - Replace with an interactive Framework Coverage Explorer and CISO Demo Booking modal that processes zero corporate documents outside local browser memory.
  3. `src/app/components/NavBar.tsx` and `src/app/components/sections.tsx`:
     - Remove all links and CTAs pointing to `/desc-isr-readiness`.

### 3.2 Visual Design System & Navigation Realignment
- **Design Tokens Enforced**:
  - Obsidian Void (`#0A0F1A`, `#05080F`, `#020408`)
  - Electric Cyan (`#00F0FF` / `#0DCAF0`) with 25% opacity cyan glow
  - Cyber Violet (`#C664FF`)
  - Status Indicators: `#22D3A8` (Healthy), `#F5B942` (Pending), `#FF5C7A` (Critical)
  - 40px Cyan Grid Overlay
- **Information Architecture**:
  - **Platform** (`#platform`): Continuous Compliance, AI Evidence Auditing, Multi-Framework Mapping.
  - **Frameworks** (`#frameworks`): DESC ISR, UAE IA, CBUAE, UAE PDPL, ISO 27001.
  - **Sovereignty** (`#sovereignty`): 3-Tier Data Sovereignty presentation.
  - **Interactive Tour** (`#interactive-demo`): Embedded, zero-backend interactive showcase.
  - **Academy** (`/courses`, `/exam-vouchers`): Cleanly segregated EC-Council courseware and certification vouchers.
  - **Book Demo**: Modal dispatching CISO leads to WhatsApp and corporate email.

### 3.3 Website-Native Interactive Showcase (`SaaSInteractiveDemo.tsx`)
- High-fidelity client-side Next.js component displaying canonical Meridian Gulf Holdings data:
  1. **Executive Dashboard**: 671 unified controls, 84% compliance score, readiness radar.
  2. **AI Review Gate Workpaper**: Simulated Corrective RAG evaluation (94% confidence, policy citations, human-in-the-loop "Approve" / "Override" toggles).
  3. **5×5 Risk Heatmap**: Dynamic risk severity matrix.
  4. **UAE PDPL Registers**: ROPA and Data Breach record ledger.
- **Resilience Guarantee**: **100% decoupled from backend availability**. Never fails during midday CI/CD deployments or migrations.

---

## 4. Workstream 2: Fortify Demo Protection Specification (`cybergoat-grc`)

*Note: Workstream 2 will be submitted as an independent PR under `tier2-audit-gate.yml`.*

### 4.1 Root Cause & Security Analysis
While PostgreSQL kernel RLS isolates tenants (`tenant_id = current_setting('app.current_tenant_id')`), Laravel Fortify account management routes operate on the authenticated user model without inspecting roles. Any visitor logged in as Layla Nasser (`GisecDemo2026!`) can call:
- `PUT /user/password` (`UpdateUserPassword.php`)
- `PUT /user/profile-information` (`UpdateUserProfileInformation.php`)
- `POST /user/two-factor-authentication` (Fortify 2FA engine)
- `DELETE /user/two-factor-authentication`
- `POST /user/confirmed-two-factor-authentication`

### 4.2 Architecture Fix (Using `Tenant::isSynthetic()`)
In accordance with Claude's directive, we do not invent a new schema column. We check `$user->tenant?->isSynthetic()`:

```php
// app/Actions/Fortify/UpdateUserPassword.php
if ($user->tenant?->isSynthetic()) {
    throw ValidationException::withMessages([
        'current_password' => ['Demo account credentials cannot be modified.'],
    ]);
}

// app/Actions/Fortify/UpdateUserProfileInformation.php
if ($user->tenant?->isSynthetic()) {
    throw ValidationException::withMessages([
        'email' => ['Demo account profile information cannot be modified.'],
    ]);
}
```

And in a dedicated `PreventDemoAccountTakeover` middleware applied to Fortify's 2FA routes:
```php
if ($request->user()?->tenant?->isSynthetic()) {
    abort(403, 'Two-factor authentication cannot be configured on shared demo accounts.');
}
```

### 4.3 Training Assignment Mutation Protection
In `app/Http/Requests/CompleteTrainingAssignmentRequest.php`:
```php
if ($user->tenant?->isSynthetic() && $user->hasRole('Auditor-Viewer')) {
    return false; // Blocks Layla from self-attesting training in demo mode
}
```

---

## 5. Execution Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EXECUTION PHASING PLAN                          │
├───────────────────────────────────┬────────────────────────────────────┤
│ Phase 1: Frontend & Decommission  │ Phase 2: Backend Demo Hardening    │
│ (Cybergoat-frontend - IMMEDIATE)  │ (cybergoat-grc - TIER-2 PR)        │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Decommission /desc-isr-readiness│ • Implement Tenant::isSynthetic()  │
│   and return 410 on /api/.../submit guard on all Fortify routes        │
│ • Build SaaSInteractiveDemo.tsx   │ • Add PreventDemoAccountTakeover   │
│ • Build SovereigntyTiersSection   │ • Write DemoTenantProtectionTest   │
│ • Update NavBar & page.tsx        │ • Pass tier2-audit-gate.yml        │
│ • Deploy to Vercel (clean build)  │ • Merge & Deploy Cloud Run         │
└───────────────────────────────────┴────────────────────────────────────┘
```

---
*End of Antigravity Audit Packet (Revised & Reconciled) — Workstream 1 Authorized to Proceed*
