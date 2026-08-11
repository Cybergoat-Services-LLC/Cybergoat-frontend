# 🏛️ CYBERGOAT END-TO-END SYSTEM ARCHITECTURE & UNWIRED AUDIT (2026)

**Project**: CyberGOAT Services LLC (`www.cybergoat.ae` & `lms.cybergoat.ae`)  
**Domain**: `cybergoat.ae` (Registrar: OnlyDomains | Nameservers: `ns1.onlydomains.com`)  
**Scope**: Complete System Topology, Real vs. Mocked Functionality, Unwired Code Assets, and Pre-Launch Gaps  

---

## 1. END-TO-END SYSTEM TOPOLOGY & WIRING DIAGRAM

```
                                [ CLIENT / VISITOR BROWSER ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
         [ HTTPS: www.cybergoat.ae ]               [ HTTPS: lms.cybergoat.ae ]
                       │                                           │
             (Vercel Edge Network)                       (GCP Cloud Run Container)
                       │                                           │
             ┌─────────┴─────────┐                       ┌─────────┴─────────┐
             │ Next.js 16 App    │                       │ Laravel 12.64     │
             │ Router Frontend   │                       │ LMS Backend API   │
             └─────────┬─────────┘                       └─────────┬─────────┘
                       │                                           │
       ┌───────────────┼───────────────┐           ┌───────────────┼───────────────┐
       │               │               │           │               │               │
 [ NextAuth.js ]  [ App Router ] [ Components] [Sanctum DB]  [Cloud SQL DB] [Filament 3]
 (Google/LinkedIn) (/api/chat)    (Forms/UI)   (Tokens)      (MySQL 8.4)   (Admin Panel)
       │               │                           │               │
       ▼               ▼                           ▼               ▼
[ OAuth Bridge ]  [ Gemini API ]             [ httpOnly ]     [ 19 Real ]
 (Laravel API)    (Direct Key)               (Cookie Session)  (Courses)
                                                   │
                       ┌───────────────────────────┼───────────────────────────┐
                       │                           │                           │
            ⚠️ [ GCS Bucket ]            🔴 [ Upstash Vector ]       🔴 [ Mail Server ]
            (cybergoat-course-kits)      (UPSTASH_VECTOR_*)          (MAIL_MAILER=log)
            (Bucket exists,              (UNPROVISIONED /            (LOG DRIVER ACTIVE /
             Files NOT uploaded!)         UNWIRED IN PROD!)           NO SMTP DELIVERY!)
```

---

## 2. REAL vs. MOCKED / UNWIRED FUNCTIONALITY MATRIX

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     FEATURE-BY-FEATURE TRUTH AUDIT                                      │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────────────────┤
│ Feature / Capability          │ Status                        │ Reality & Discrepancy Breakdown         │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ Student Authentication        │ 🟢 100% WIRED                 │ Email/Password + Google & LinkedIn      │
│ (Sanctum + NextAuth)          │                               │ OAuth server-side introspection working.│
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ PHPUnit Backend Test Suite    │ 🟢 285 / 285 PASSING          │ All 285 tests pass cleanly in PHPUnit   │
│                               │                               │ using MOCKED AI & Vector responses.     │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ Courseware PDF Downloads      │ 🔴 CODE BUILT / UNWIRED FILES │ Signed V4 URL code works in tests, BUT  │
│ (`/download-kit`)             │                               │ GCS bucket `cybergoat-course-kits-prod` │
│                               │                               │ has ZERO PDF files uploaded to it!      │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ Multi-Framework AI Assessor   │ 🔴 CODE BUILT / UNWIRED CLOUD │ Code built for DESC ISR, PDPL, AI Sec.  │
│ (`/desc-isr-readiness`)       │                               │ But Upstash Vector credentials are      │
│                               │                               │ UNPROVISIONED in production (.env)!     │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ Client Email Report Delivery  │ 🔴 CODE BUILT / LOG ONLY      │ Report PDF generator works, BUT backend │
│ (`ComplianceReportService`)   │                               │ uses `MAIL_MAILER=log` (writes to log,  │
│                               │                               │ does NOT send real client emails!).     │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ Public Homepage Catalog       │ 🔴 DISCONNECTED / STATIC      │ Public homepage (`CoursesGrid.tsx`) uses│
│ (`www.cybergoat.ae`)          │                               │ static hardcoded array, NOT real        │
│                               │                               │ backend database `GET /v1/courses`.     │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ CISM Presentation Decks       │ 🔴 UNUPLOADED ASSETS          │ 4 module decks + 1 assessment deck sit  │
│ (Lesson & Quiz Generation)    │                               │ on Google Drive, unuploaded to Filament.│
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────┤
│ Git Remote Synchronization    │ ⚠️ UNPUSHED LOCAL COMMITS     │ Backend has 16 unpushed local commits.  │
│ (Production Repos)            │                               │ Frontend has 15 unpushed local commits. │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────────────────┘
```

---

## 3. IN-DEPTH DISSECTION OF "IN CODE ONLY" ASSETS (UNWIRED CODE)

### A. Why 285 Backend Tests Passed 100% While Production Gaps Existed
- **The Technical Reason**: PHPUnit unit tests use **mocks & stubs** (`CallsVertexAi` mock, `$this->app->instance(ComplianceVectorStore::class, $mock)`).
- Unit tests verify that *if* Upstash Vector or GCS returns data, the Laravel logic handles it correctly. 
- However, unit tests do **not** verify whether a live account has been provisioned or whether real PDF files exist in GCS!

### B. The GCS Course Kit PDF Gap (`cybergoat-course-kits-prod`)
- **Code Status**: `GcsKitSigner.php` and `KitController.php` endpoints (`POST /v1/courses/{slug}/download-kit`) are 100% written and passing tests.
- **Physical Gap**: The GCS bucket `gs://cybergoat-course-kits-prod/` is empty. If an enrolled student clicks "Download CHFI Kit", the API returns a 404/file-not-found from Google Cloud Storage because the `.pdf` file was never uploaded to the bucket.

### C. The Upstash Vector Credentials Gap
- **Code Status**: `ComplianceVectorStore.php` namespacing (`/upsert-data/submission-{id}`) and `ComplianceScoringService.php` 4-layer prompt injection protections are written.
- **Physical Gap**: `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN` are absent from `.env` and Cloud Run environment variables. When a user submits documents, the vector store fails gracefully and logs an error because no Upstash database instance exists.

### D. The Mail Transport Gap (`MAIL_MAILER=log`)
- **Code Status**: `ComplianceReportService.php` PDF generator and human SME sign-off gate (`approveAndSend`) are written.
- **Physical Gap**: `MAIL_MAILER` is set to `log`. When an admin approves a report in Filament, Laravel writes the email HTML to `storage/logs/laravel.log` instead of dispatching it via SMTP to the client's email inbox.

### E. The Public Homepage Catalog Disconnect (`CoursesGrid.tsx`)
- **Code Status**: `GET /v1/courses` returns 19 real courses dynamically from MySQL.
- **Physical Gap**: `src/app/components/CoursesGrid.tsx` on `www.cybergoat.ae` renders a hardcoded static array of 6 courses instead of calling `GET /v1/courses`.

---

## 4. DOMAIN, DNS & EMAIL INFRASTRUCTURE AUDIT

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                DOMAIN & DNS CONFIGURATION                              │
├───────────────────────┬───────────────────────────────┬────────────────────────────────┤
│ Host / Subdomain      │ Target Destination            │ Status                         │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ `cybergoat.ae` (Apex) │ Vercel Anycast IP             │ 🟢 Verified & SSL Active       │
│                       │ (`216.198.79.1`)              │                                │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ `www.cybergoat.ae`    │ Vercel CNAME                  │ 🟢 Verified & SSL Active       │
│                       │ (`622ed5de...vercel-dns.com`) │                                │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ `lms.cybergoat.ae`    │ GCP Cloud Run Service         │ 🟢 Verified & SSL Active       │
│                       │ (`cybergoat-lms-...run.app`)  │                                │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ Google Workspace Mail │ `aspmx.l.google.com` (MX)     │ 🟢 5 MX Records Active         │
│ (`admin@cybergoat.ae`)│ `v=spf1 include:_spf...` (SPF)│ 🟢 SPF + DKIM + DMARC Active   │
└───────────────────────┴───────────────────────────────┴────────────────────────────────┘
```

---

## 5. THE 5-STEP AUDIT RECTIFICATION PLAN (PRE-LAUNCH ACTION ITEMS)

To make everything 100% wired, functional, and production-ready:

1. **Step 1: Upload Courseware PDFs to GCS**:
   - Upload physical PDF files into `gs://cybergoat-course-kits-prod/course-kits/{slug}-student-kit.pdf`.

2. **Step 2: Provision Upstash Vector Database**:
   - Create a free Upstash Vector index and add `UPSTASH_VECTOR_REST_URL` & `TOKEN` to Cloud Run environment variables.

3. **Step 3: Enable Production Transactional SMTP**:
   - Set `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=465`, `MAIL_USERNAME=admin@cybergoat.ae`, `MAIL_PASSWORD=[App-Password]` in Cloud Run environment variables.

4. **Step 4: Wire Public Homepage Catalog to Live API**:
   - Update `CoursesGrid.tsx` on `www.cybergoat.ae` to fetch `GET /v1/courses` dynamically.

5. **Step 5: Process CISM Presentation Decks via Filament**:
   - Upload CISM module decks and assessment bank via Filament Admin to populate real lessons and quizzes in MySQL.
