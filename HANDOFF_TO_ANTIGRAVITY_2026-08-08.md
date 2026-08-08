# 📜 CYBERGOAT REFINED MASTER HANDOFF & MEMORY SPECIFICATION (2026-08-08)

**Project**: CyberGOAT Services LLC (`www.cybergoat.ae` & `lms.cybergoat.ae`)  
**Entity**: CYBERGOAT SERVICES - FZCO (IFZA Business Park, Dubai Silicon Oasis, Dubai, UAE)  
**Reseller License**: EC-Council Authorized Reseller (`ECRS21832`)  
**Banking**: Wio Bank PJSC (AED IBAN: `AE220860000009100624064`, SWIFT: `WIOBAEADXXX`)  

---

## 🟢 1. SYSTEM REALITY & OPERATIONAL BASELINE

### A. Next.js 16 Student Portal & Marketing Engine (`www.cybergoat.ae`)
- **Hosting**: Vercel Global Edge CDN (SSG pre-rendering, ~15ms UAE response time).
- **Authentication**:
  - Email & Password login (`/login`).
  - **1-Click Google OAuth 2.0**: Active (`Client ID: 60357540803-...`).
  - **1-Click LinkedIn OpenID Connect**: Active (`Client ID: 77yi4zhv8khz73`).
  - Server-side token bridge (`/api/portal/social-callback`) issuing httpOnly session cookies (`portal_token`).
- **Legal Compliance**:
  - KHDA Wording: `"Dubai HQ & Virtual Bootcamps"` (100% compliant with DSO Free Zone license).
  - Explicit disclaimers for EC-Council Authorized Vouchers vs ISACA / ISC2 / IAPP / TOGAF 10 exam readiness.
- **Tax Handling**: **0% VAT** on all invoices (under AED 187.5k threshold), clean commercial invoices.

### B. Laravel 12 LMS Backend (`cybergoat-lms`)
- **Hosting**: GCP Cloud Run (`https://cybergoat-lms-60357540803.us-central1.run.app`) with `min-instances=1`.
- **Database**: Cloud SQL MySQL 8.4 (`cybergoat-db`).
- **Test Suite**: **285 / 285 Passing PHPUnit Tests**.
- **Security**: `SocialAuthVerifier` (Google `aud` claim checks & LinkedIn token introspection). Trusted proxy IP rate limiting.
- **Operating Cost**: **$0.00 / month** (backed by **$2,000 USD Google Cloud Startup Grant**).

### C. Compliance Assessor (multi-regulation, as of 2026-08-08)
The lead tool behind `POST /v1/compliance-assessor/submit` now assesses against three
regulations rather than one. **Committed locally, NOT deployed** — nothing ships until
explicitly approved.

- **Regulations seeded** (all share `compliance_controls`, distinguished by a `regulation` column):
  - `desc_isr` — DESC ISR v3.1 domains 1–4. 86 requirements, 23 main controls. Unchanged.
  - `pdpl` — UAE Federal Decree-Law No. 45 of 2021. 31 Articles → 197 requirements.
    22 Articles are scored (those binding a Controller or Processor); the rest are seeded
    but not assessed — they address the Bureau, the Council of Ministers or the legislature.
  - `ai_security_policy` — DESC AI Security Policy v1. 15 sections → 30 requirements,
    split by stakeholder role: 14 Provider, 12 Consumer, 3 End-User, 1 role-agnostic (§1.3
    Data Location, the UAE data residency rule, assessed for every role).
  - Seeders: `ComplianceControlSeeder`, `PdplControlSeeder`, `AiSecurityPolicyControlSeeder`.
    Each is scoped to its own regulation and safe to re-run.

- **ACCURACY RULE THAT MUST NOT BE UNDONE**: ~13 PDPL requirements are flagged
  `deferred_to_exec_regs`. The Decree-Law defers those specific periods, thresholds and
  lists to Executive Regulations that could not be confirmed published through any official
  UAE channel. Scoring tells the model, by requirement number, to assess only whether the
  underlying practice is documented, and explicitly excludes the GDPR's 72-hour breach
  window and one-month DSR period by name. **Do not add a "72-hour DESC rule" or a "30-day
  PDPL SLA" anywhere** — both were traced to misattributed GDPR figures earlier in this
  project. The report tells the client this too.

- **PDPL free-zone scope gate**: Article 2(2)(g) exempts free-zone entities with their own
  personal data legislation (DIFC, ADGM). `is_free_zone_entity` is *required* at intake
  whenever PDPL is selected. A free-zone submitter gets an informational scope note instead
  of PDPL findings — excluded from every count and percentage, shown as "Not Applicable".

- **Intake fields**: `frameworks` (JSON array, defaults to `["desc_isr"]` if absent so the
  current public form keeps working), `is_free_zone_entity`, `ai_stakeholder_role`
  (required when the AI policy is selected). `GET /v1/compliance-assessor/limits` publishes
  both option lists for the front end.

- **Scores are per regulation, never blended.** `frameworkScores()` is the source of truth
  for the review desk, the PDF and the covering email.

- **Front end still to do**: `www.cybergoat.ae` does not yet offer the framework checkboxes,
  the free-zone question or the AI role question. The API accepts submissions without them
  and treats those as ISR-only.

---

## 🚀 2. REFINED 4-PHASE EXECUTION ROADMAP

### PHASE 1: FRONTEND AI POSITIONING & BRANDING UPDATES
1. **AI-Powered Adaptive Learning Engine (Pillar 1)**:
   - Hero Badge: `"AI-Guided Cyber Range & 24/7 Technical Tutor"`.
   - Strategy Card: Real-time AI lab hints, threat scenario simulations & automated skill gap diagnostics.
2. **Corporate B2B AI Consulting & Innovation Advisory (Pillar 2)**:
   - Corporate Hub (`#corporate`): Add service option `"Enterprise AI Consulting & Innovation Advisory"`.
   - GRC Section: GenAI Governance, LLM Red Teaming, NIST AI RMF & UAE AI Ethics audits.

### PHASE 2: PUBLIC CATALOG API & CERTIFICATE VERIFICATION
1. **Public Catalog API Synchronization**:
   - Connect `CoursesGrid.tsx` on `www.cybergoat.ae` to live backend `GET /v1/courses` API (19 real courses).
2. **Public Certificate Verification Search Engine (`/verify`)**:
   - Build public verification page at `https://www.cybergoat.ae/verify` for employers and students.

### PHASE 3: CAMPAIGN & AD INTEGRATION
1. **Google AdWords Conversion Pixel**:
   - Inject GTM & conversion tracking on `#corporate` form & Skill Assessment modal.
2. **LinkedIn Sales Navigator Integration**:
   - Map InMail campaign targets to corporate inquiry hub + secondary domain cold outreach strategy (`cybergoat.io`).

### PHASE 4: CONTENT & STORAGE INGESTION
1. **GCS PDF Uploads**: Upload physical PDF courseware files to `gs://cybergoat-course-kits-prod/course-kits/{slug}-student-kit.pdf`.
2. **CISM Presentation Decks**: Upload 4 module decks + 1 assessment deck via Filament Admin using the `PptxSlideExtractor` AI pipeline.
