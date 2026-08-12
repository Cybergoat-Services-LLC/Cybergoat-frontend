# 🏛️ SYSTEM DUE DILIGENCE & ARCHITECTURE MASTER AUDIT (2026)
**Document Title**: Comprehensive Technical Due Diligence, Inventory & Operational Readiness Report  
**Entity**: CyberGOAT Services LLC (`CYBERGOAT SERVICES - FZCO`, IFZA Business Park, DSO, Dubai, UAE)  
**Domains Audited**: `www.cybergoat.ae` (Frontend) & `lms.cybergoat.ae` (Backend API)  
**Auditor**: Independent Technical Due Diligence & Architecture Audit Engine  

---

##  EXECUTIVE SUMMARY & THE 3 PRINCIPLES OF TRUTH

This report provides an unvarnished, empirical audit of the entire CyberGOAT platform codebase, cloud infrastructure, domain settings, third-party integrations, and secret credentials.

To eliminate confusion between *code that passes unit tests* vs. *code that actually works in production*, every component in this audit is evaluated against **3 Principles of Truth**:

1. **Unit Test Pass ≠ Live Production Wiring**: Unit tests mock third-party services (Gemini, Upstash, GCS). 285 passing backend tests mean the code is syntactically sound, but does not guarantee cloud resources exist.
2. **Git Push ≠ Cloud Deployment**: Pushing code to GitHub backs up source code; it does not deploy Cloud Run or Vercel. Deploys require CLI builds (`gcloud run deploy`, `vercel --prod`).
3. **"Zero Retention" is not accurate, and neither is "Delete-After-Send"**: Confirmed directly against `ComplianceReportService`/`ComplianceVectorStore` - only the AI vector namespace used for scoring is cleared after report delivery. The raw uploaded files remain in GCS; they are not deleted. Any customer-facing privacy copy must reflect that raw documents are retained, not "deleted upon report delivery."

---

## 1. END-TO-END ARCHITECTURE & NETWORK WIRING DIAGRAM

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     VISITOR & USER BROWSER                                       │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │                                                 │
          [ HTTPS: www.cybergoat.ae ]                       [ HTTPS: lms.cybergoat.ae ]
                        │                                                 │
             (Vercel Edge Network)                             (GCP Cloud Run Service)
             Next.js 16 App Router                            Laravel 12.64 PHP 8.4
                        │                                                 │
      ┌─────────────────┼─────────────────┐             ┌─────────────────┼─────────────────┐
      │                 │                 │             │                 │                 │
 [NextAuth.js]    [App Router API]  [Client UI]  [Sanctum DB Tokens]  [Cloud SQL DB]   [Filament 3 Admin]
 (Google/LinkedIn) (/api/chat)      (Forms/Cards) (httpOnly Cookie)   (MySQL 8.4)      (/admin)
      │                 │                               │                 │                 │
      ▼                 ▼                               ▼                 ▼                 ▼
[OAuth Bridge]    [Gemini 2.0 API]               [Active Session]    [19 Dynamic]     [Human SME Review]
(Laravel API)     (Direct Key)                    (Bearer Auth)       (Courses)        (Report Approve)
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        │                               │                               │
             ⚠️ [ GCS Storage Bucket ]          🔴 [ Upstash Vector ]           🔴 [ SMTP Email Server ]
             (cybergoat-course-kits-prod)       (UPSTASH_VECTOR_*)              (MAIL_MAILER=log)
             (Bucket exists; PDFs empty!)       (UNPROVISIONED /                (LOG DRIVER ACTIVE /
                                                 UNWIRED IN PROD!)               NO CLIENT EMAILS SENT!)
```

---

## 2. COMPLETE INVENTORY OF CREDENTIALS, LOGINS & INTEGRATIONS

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CREDENTIAL & INTEGRATION INVENTORY                                     │
├───────────────────────┬───────────────────────────────┬──────────────────┬───────────────────────────────┤
│ Integration Name      │ Configuration Key / Env Var   │ Target System    │ Provisioning & Health Status  │
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ Google Vertex AI      │ `GOOGLE_VERTEX_PROJECT_ID`    │ GCP Vertex AI    │ 🟢 Provisioned & Operational  │
│ (Gemini 2.5/2.0 Pro)  │ `GOOGLE_VERTEX_LOCATION`      │ `us-central1`    │ (Batched 10-control calls).   │
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ Cloud SQL MySQL 8.4   │ `DB_HOST`, `DB_DATABASE`      │ GCP Cloud SQL    │ 🟢 Provisioned & Operational  │
│ (Database Engine)     │ `cybergoat-db`                │ `cybergoat-lms`  │ (All tables & seeds loaded).  │
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ Google Cloud Storage  │ `STORAGE_BUCKET_NAME`         │ GCP Storage      │ ⚠️ Bucket Provisioned, BUT    │
│ (GCS File Bucket)     │ `cybergoat-course-kits-prod`  │ Uniform Access   │ Courseware PDF files EMPTY!   │
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ Upstash Vector DB     │ `UPSTASH_VECTOR_REST_URL`     │ Upstash Vector   │ 🔴 UNPROVISIONED / ABSENT     │
│ (Semantic Search)     │ `UPSTASH_VECTOR_REST_TOKEN`   │ REST Endpoint    │ from production environment!  │
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ Transactional Email   │ `MAIL_MAILER`                 │ Google Workspace │ 🔴 UNPROVISIONED / LOG ONLY   │
│ (SMTP Relay)          │ `MAIL_USERNAME`               │ `smtp.gmail.com` │ (`MAIL_MAILER=log` active!).  │
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ NextAuth Social OAuth │ `GOOGLE_OAUTH_CLIENT_ID`      │ Google &         │ 🟢 Provisioned & Operational  │
│ (Google / LinkedIn)   │ `LINKEDIN_OAUTH_CLIENT_SECRET`│ LinkedIn OAuth   │ (Introspection bridge active).│
├───────────────────────┼───────────────────────────────┼──────────────────┼───────────────────────────────┤
│ Stripe Payments       │ `STRIPE_SECRET_KEY`           │ Stripe API       │ 🟢 Code Built (Awaiting live  │
│ (Self-Service)        │ `STRIPE_WEBHOOK_SECRET`       │ Webhooks         │ production API keys).         │
└───────────────────────┴───────────────────────────────┴──────────────────┴───────────────────────────────┘
```

---

## 3. WHAT IS 100% WIRED, LIVE & FUNCTIONAL

1. **Student Sanctum Authentication & Social OAuth Bridge**:
   - `portalAuth.ts` sets `httpOnly` secure cookies.
   - `SocialAuthVerifier.php` introspects incoming Google/LinkedIn tokens server-side.
2. **Multi-Framework Compliance Assessor Logic**:
   - Intake form at `/desc-isr-readiness` supporting DESC ISR v3.1, UAE PDPL, and DESC AI Security Policy v1.
   - `ComplianceScoringService.php` control batching (10 controls per call) with fine-grained RAG retrieval.
3. **Backend Test Suite Quality**:
   - **285 / 285 PHPUnit Tests Passing (100% Pass Rate)** covering all services, models, and controllers.
4. **Filament Admin Control Panel (`/admin`)**:
   - Full admin UI for course management, assessment review, offline invoice approvals, and certificate issuance.
5. **Domain & SSL DNS Routing**:
   - `www.cybergoat.ae` (Vercel) & `lms.cybergoat.ae` (Cloud Run) configured with active SSL.

---

## 4. WHAT EXISTS IN CODE BUT IS UNWIRED / ORPHANED IN PRODUCTION

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    "IN CODE ONLY" UNWIRED ASSETS                                         │
├───────────────────────────────┬──────────────────────────────────────────────────────────────────────────┤
│ Unwired Item                  │ Detailed Root Cause & Exact Fix Required                                 │
├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ 1. GCS Course Kit PDFs        │ Code for `POST /v1/courses/{slug}/download-kit` works, BUT GCS bucket    │
│    (`cybergoat-course-kits`)  │ `gs://cybergoat-course-kits-prod/` has ZERO PDF files uploaded!          │
│                               │ ➔ Fix: Upload physical `.pdf` files to GCS bucket.                       │
├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ 2. Upstash Vector Credentials │ Code in `ComplianceVectorStore.php` enforces per-submission namespaces, │
│    (`UPSTASH_VECTOR_*`)       │ BUT `UPSTASH_VECTOR_REST_URL` & `TOKEN` are missing in production `.env` │
│                               │ ➔ Fix: Create free Upstash Vector index & add credentials to Cloud Run.   │
├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ 3. Client SMTP Email Server   │ `ComplianceReportService` compiles PDFs, BUT `MAIL_MAILER=log` writes    │
│    (`MAIL_MAILER=log`)        │ email HTML to log files instead of sending real client emails!           │
│                               │ ➔ Fix: Set `MAIL_MAILER=smtp` with Google Workspace App Password.        │
├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ 4. Public Homepage Catalog    │ Public homepage (`CoursesGrid.tsx`) uses a hardcoded static array of 6   │
│    (`CoursesGrid.tsx`)        │ courses instead of fetching dynamic `GET /v1/courses` (19 courses in DB).│
│                               │ ➔ Fix: Update `CoursesGrid.tsx` to fetch `GET /v1/courses` dynamically.   │
├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ 5. CISM Presentation Decks    │ 4 CISM module decks + 1 assessment deck sit on Google Drive, unuploaded. │
│    (Slide Importer)           │ ➔ Fix: Upload `.pptx` files via Filament Admin to generate lessons/quizzes.│
└───────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
```

---

## 5. DOMAIN, DNS & EMAIL INFRASTRUCTURE HEALTH

- **Domain Registrar**: OnlyDomains (`cybergoat.ae`, Nameservers: `ns1.onlydomains.com`).
- **Apex Domain (`cybergoat.ae`)**: Points to Vercel Anycast IP `216.198.79.1` (Active).
- **Subdomain (`www.cybergoat.ae`)**: Points to Vercel CNAME `622ed5de...vercel-dns.com` (Active).
- **LMS API Subdomain (`lms.cybergoat.ae`)**: Points to GCP Cloud Run (Active).
- **Email Infrastructure (`admin@cybergoat.ae`)**: Google Workspace MX (`aspmx.l.google.com`) + SPF (`v=spf1 include:_spf.google.com ~all`) + DKIM + DMARC active.

---

## 6. BUSINESS STAKES & PRE-LAUNCH COMPLIANCE CHECKLIST

Before launching public marketing campaigns or accepting paid corporate clients:

1. **Brand & Trademark Integrity**:
   - Maintain strict separation between **Official EC-Council Reseller Accreditation (`ECRS21832`)** vs. **Independent Exam Prep (ISACA CISA/CISM & ISC2 CISSP)**.
2. **Data Privacy Protection**:
   - Do not describe the data lifecycle as "Delete-After-Send" or "Zero Retention" in any customer-facing copy - it is factually inaccurate. Only the AI vector namespace is cleared after report delivery; raw uploaded documents remain retained in GCS. Communicate the accurate retention behavior instead.
3. **Execution Readiness Checklist**:
   - [ ] Upload Courseware PDFs to GCS bucket.
   - [ ] Add Upstash Vector credentials to Cloud Run `.env`.
   - [ ] Set `MAIL_MAILER=smtp` with Google Workspace App Password.
   - [ ] Connect `CoursesGrid.tsx` to dynamic API `GET /v1/courses`.
   - [ ] Upload CISM presentation decks via Filament.
