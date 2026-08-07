# 📜 CYBERGOAT MASTER HANDOFF & PROJECT MAP (2026-08-07)

**Purpose**: the single reference for understanding this whole system without re-deriving it from scratch. Read this before exploring the codebase blind. **Update this file after any significant change** — new feature, schema change, deploy pattern change, or newly-discovered gotcha. Superseded the 2026-08-04 version (kept for history) — most of that doc is now stale (it said 126 tests; we're at 175, and it predates the entire lessons/modules pipeline, security hardening, and checkout flow below).

---

## 1. THE TWO REPOS

| Repo | Path | Stack | Hosting |
|---|---|---|---|
| Frontend | `C:\Users\khati\.gemini\antigravity\scratch` | Next.js 16 (App Router, Turbopack) | Vercel — `www.cybergoat.ae` / `lms.cybergoat.ae` |
| Backend | `C:\Users\khati\.gemini\antigravity\scratch\cybergoat-laravel-lms` | Laravel 12 + Filament 3 | Cloud Run — `cybergoat-lms-60357540803.us-central1.run.app` |

Both are separate git repos with separate remotes (`Cybergoat-Services-LLC/Cybergoat-frontend`, `Cybergoat-Services-LLC/cybergoat-lms`). Neither pushes to GitHub automatically this session — everything is committed locally then deployed via `gcloud`/`vercel` CLI directly from source, not via a CI pipeline.

**Stale/dead folders inside `scratch/` — do not confuse with the real backend**: `backend-reference/` and `cybergoat-lms-backend/` are old/reference copies, not deployed anywhere. `cybergoat-laravel-lms/` is the one that's actually live.

**Duplicate project copies exist on disk** (not in git, just local): `.gemini/antigravity-backup/` and `.gemini/antigravity-ide/` are stale full copies of this same project from other tool sessions. Don't edit them; they're not deployed from.

---

## 2. INFRASTRUCTURE MAP

- **GCP Project**: `gen-lang-client-0992165942`, billing via "My Billing Account" (`01412D-2282DD-8BF45B`) — has ~$2,294 in credits as of 2026-08-07 ($1,997.97 GFS Cloud Program, valid to 2027-08-04; $295.88 free trial, valid to 2026-10-28).
- **Cloud Run service**: `cybergoat-lms`, region `us-central1`, `min-instances=1` (set 2026-08-07 to kill cold-start latency — costs ~$15-25/mo, funded by credits above).
- **Cloud Run jobs**: `migrate-cybergoat-lms` (runs `artisan migrate --force`, reused every deploy — update its `--image` to the new digest, then `execute --wait`). No permanent seed job exists — one was created ad hoc (`seed-cybergoat-lms`) and is reusable for one-off admin commands (update its image+command+args, execute, useful pattern for future one-off production tasks — see §6).
- **Cloud SQL**: `cybergoat-db` (MySQL), database `cybergoat_lms_laravel`.
- **GCS bucket**: `cybergoat-course-kits-prod` — course kit PDFs (`course-kits/{slug}-student-kit.pdf`), manuals (`course-manuals/{slug}-reference-manual.pdf`), module decks (`assessment-sources/{course-slug}/...`). **Currently near-empty** — no kit/manual PDFs have actually been uploaded for any course yet, only the pipeline exists.
- **Domain**: `cybergoat.ae`, registrar `onlydomains.com` (NOT Google Cloud DNS — that API isn't even enabled on this project). MX records point to Google Workspace correctly (verified 2026-08-07 from 3 independent resolvers incl. Google's own 8.8.8.8) — an admin-console "no mail server" warning was confirmed **stale**, not real.
- **Vercel project**: `cybergoat-frontend`, org `cybergoat`.

---

## 3. DEPLOY RUNBOOK (the exact commands, copy-paste ready)

**Backend:**
```bash
cd cybergoat-laravel-lms
gcloud run deploy cybergoat-lms --source . --region us-central1 --quiet
```
Then, **only if a new migration was added**:
```bash
gcloud run services describe cybergoat-lms --region=us-central1 --format="value(spec.template.spec.containers[0].image)"
gcloud run jobs update migrate-cybergoat-lms --region=us-central1 --image=<digest-from-above>
gcloud run jobs execute migrate-cybergoat-lms --region=us-central1 --wait
```

**Frontend:**
```bash
vercel --prod --yes --archive=tgz
```
The `--archive=tgz` is **required** — a plain `vercel --prod --yes` fails past ~15,000 files (this repo has way more once `node_modules` is counted) with `missing_archive`.

**Gotchas hit repeatedly this session:**
- `gcloud run deploy` intermittently fails with `Failed to resolve 'cloudbuild.googleapis.com'` — a transient local DNS blip, not a real problem. Just retry; confirm via `gcloud run revisions list` that no new revision was actually created before assuming a retry is safe.
- `gcloud auth login` session can expire mid-session ("Reauthentication failed, cannot prompt non-interactively") — needs the user to run `gcloud auth login` themselves in their own terminal; can't be done from an automated shell.
- **Destructive/high-risk gcloud actions get blocked by a permission classifier** even after in-chat approval: `gcloud storage cp` (uploads), `gcloud run services update --min-instances` (cost-changing), anything that reconfigures a job to run a DB-deleting command. Hand the exact command to the user to run themselves rather than fighting it.
- Complex inline PHP (`artisan tinker --execute="..."`) passed through `gcloud run jobs update --args=...` breaks unpredictably across Bash→Windows-cmd→gcloud→container quoting layers, especially with commas or `|`. **Don't fight this** — write a real one-off Artisan command class instead, commit it, deploy, run it as a job, then delete it. Much more reliable.
- On Windows, `gcloud run jobs ... --args` is comma-delimited by default, which breaks if your args contain commas (e.g. PHP array/function syntax). Use `--args="^|^a|b|c"` to switch delimiter — but this itself broke once due to shell layering; prefer the one-off-command-class approach above.

---

## 4. FEATURE INVENTORY (what's actually built and live)

### Student-facing (frontend, `www.cybergoat.ae`)
- Public marketing site: hero, career-pathway stages, salary benchmarks, testimonials, GRC content, corporate B2B lead form, AI chatbot widget. **Course catalog here (`CoursesGrid.tsx`/`courses-data.ts`) is hardcoded static data — NOT connected to the real backend.** Shows different/more courses than actually exist in the database. "Inquire/Enroll" buttons open a contact modal only, no real purchase path from here. **This disconnect is a known, unaddressed gap** — flagged 2026-08-07, not yet scheduled.
- `/login`, `/register` — real, backend-driven. Session cookie `portal_token`, 90-day expiry, httpOnly. Uses a **hard navigation** (`window.location.href`, not `router.push`) to `/dashboard` after auth — a client-side soft nav was causing an intermittent "logged in then immediately bounced back to login" bug, fixed 2026-08-07.
- `/dashboard` — real student dashboard: stats, enrolled courses, live classes, certificates, "Browse Courses" nav button.
- `/dashboard/courses` — **real**, backend-driven course catalog (all 19 real courses, real prices) — this is the one to point students at for browsing, NOT the public marketing page.
- `/dashboard/courses/[slug]/lessons` — course-detail/syllabus view: About section, module/lesson/duration stats, per-module summaries, lesson body (markdown + Mermaid diagrams), video download.
- `/dashboard/checkout/[slug]` — real checkout: coupon validation, price/VAT display, Card (Stripe-hosted) or Bank Transfer/Aani QR payment choice.
- `/checkout/success`, `/checkout/cancelled` — **site root, not under `/dashboard`** (hardcoded into the backend's Stripe redirect URLs, don't move these). Success page polls real payment status (handles the Stripe-redirect-before-webhook race), never shows false success.
- `/admin/leads`, `/admin/training` — NOT part of the Laravel admin. Separate, gated by a single shared `ADMIN_API_KEY` secret (in `.env.local`, also on Vercel) sent as a header — no per-user login. `/admin/leads` = enquiry inbox; `/admin/training` = chatbot Q&A training.

### Admin-facing (backend, Filament at `/admin`)
Courses, Enrollments, Invoices (confirm bank/Aani payments here), Live Classes (auto-generates real Google Meet links), Coupons, Certificates, Quizzes (AI-assisted question generation), External Resources, **Modules/Lessons** (upload a PPTX deck → AI drafts lesson content + optional Mermaid diagrams, review before publish), **Assessment deck import** (upload one deck per course → deterministic MCQ extraction from speaker notes → admin confirms module mapping → imports into Quiz/Question).

### Backend systems
- Auth: Sanctum Bearer tokens (never expire server-side — the cookie is the only real expiry), Google/LinkedIn OAuth bridge (`SocialAuthVerifier` independently re-verifies tokens, doesn't trust the bridge secret alone).
- Payments: Stripe Checkout (webhook-confirmed, not redirect-confirmed) + manual Bank Transfer/Aani QR (admin-confirmed). Coupons, VAT toggle, course bundling (free-with-paid).
- Certificates: 3 types, auto + manual issue, public verification page.
- AI content pipeline: `PptxSlideExtractor` (pure PHP, no LibreOffice — parses OOXML directly; divider slides detected by layout **name** `"Topic- Multi"`, question slides by `"1_Practice_Q"`; correct answers come from speaker-notes plain text, NOT slide formatting — this was the single biggest wrong assumption corrected during the original build, verified 200/200 on a real deck). `ModuleContentGeneratorService` (Gemini drafts lesson prose + optional Mermaid diagrams). `AssessmentDeckImportService` (deterministic, no AI, for the graded question bank).
- Background jobs run via **scheduled polling commands**, not a queue worker — **Cloud Scheduler is disabled on this GCP project**, so `routes/console.php`'s `Schedule::command(...)` entries never actually fire in production. Anything meant to run on a schedule needs a manual trigger (Filament "Process now" buttons exist for this reason) until Cloud Scheduler gets enabled.

---

## 5. DATA MODEL QUICK REFERENCE

Courses (19 real, live as of 2026-08-07): CEH v13 AI, CHFI v11, C\|CISO v4, CISA, CISM, CISSP, CND v2, CTIA, CSA, CPENT, CCSE, ECIH v2, Ethical Hacking Essentials (free), CRISC, CIPP/E, CIPM, DPO Training, Applied ESA, VAPT. **13 of these were entered by hand via Filament by a business partner with real cert codes/pricing — not seeded by code.** 6 were added via `CybergoatSeeder.php` (CRISC, CIPP/E, CIPM, DPO Training, Applied ESA, VAPT) at a flat 5,700 AED default since no specific pricing was given. CISA/CISM/CISSP are shared between both sources unchanged.

**⚠️ Real incident, 2026-08-07**: a seeder run created 8 duplicate courses because it didn't know a partner had already hand-entered those same certs under different slugs with real pricing. Cleaned up via a one-off Artisan command (11 rows removed). **Lesson: before running any seeder against production, check Filament for existing data first** — this project has more than one person able to write directly to the course catalog.

Key models: `Course` → `Module` (hasMany) → `Lesson` (hasMany) → `LessonCompletion` (per-user, added 2026-08-07). `Course` → `Quiz` (hasOne, or per-Module) → `Question`. `Enrollment`, `Invoice` (→ `markPaidAndEnroll()`), `Certificate`, `LiveClass`, `Coupon`, `AssessmentQuestionImport` (staging table for admin-confirmed question imports), `KitDownload`.

---

## 6. TESTING

Backend: `C:\php\php.exe artisan test` — **175 tests passing** as of 2026-08-07, zero known regressions. Full suite re-run after every change this session; treat a red suite as blocking.
Frontend: no automated test suite exists. Verification is `npx tsc --noEmit` + manual live-browser checks against the deployed site (this session's actual practice — see §7).

---

## 7. LIVE VERIFICATION PATTERN (how this session actually confirms things work)

There's a persistent QA test account for exactly this: `qa.test.student.20260806@cybergoat-test.local` / `QaTest#Pass2026` — zero enrollments, safe to log into repeatedly for UI verification without touching real student data. Standard pattern after any deploy: health check (`/api/health`), then a real login through the actual site (not just curl) to confirm no regression in the auth flow, since that's broken the most times this session.

---

## 8. WHAT'S GENUINELY PENDING

- **Real CISM course content**: 4 module decks + 1 assessment deck exist on the admin's Google Drive (`G:\My Drive\LMS Content\Classroom Content\CISM - Complete\CyberGOAT destination folder\`) but haven't been uploaded via Filament yet — blocked on the human doing the upload (files are 20-50MB each, too large for available browser automation, and it's genuinely their action to take).
- **RAG chatbot** (replacing the manual `/admin/training` Q&A entry with real semantic search over course/FAQ content): blocked on provisioning an Upstash Vector database (separate product from the Redis already in use) — needs `UPSTASH_VECTOR_REST_URL`/`TOKEN` in `.env.local` + Vercel.
- **Public marketing catalog disconnect**: still hardcoded, not fixed. Real scope: rewire `CoursesGrid.tsx` to fetch `GET /v1/courses` instead of static data.
- **MTA-STS DNS record**: optional email hardening, deferred, not urgent.
- **Manual/kit PDFs**: the download endpoints exist and are tested, but no actual PDF files have been uploaded to the GCS bucket for any course yet.

---

## 9. SECURITY POSTURE (as of 2026-08-07 audit)

Full backend + frontend security audit completed and all findings fixed same day: trusted-proxy fix for Cloud Run (rate limiting was previously keyed to one shared bucket for all traffic, not per-attacker — this was the one real, exploitable finding), CSP header added, timing-safe admin-key comparison, PPTX zip-bomb/XXE hardening, course-detail field whitelisting, CORS made explicit. No critical/high findings remain open. Re-run a fresh audit before any major new externally-facing feature.

---

## 10. LEGAL/COMPLIANCE NOTES (carried forward from 2026-08-04, still accurate)

- KHDA wording: `"Dubai HQ & Virtual Bootcamps"` — compliant with the DSO free zone license, don't revert this wording.
- EC-Council®, CEH®, C\|CISO®, CHFI® etc. are registered EC-Council trademarks; CIPP/E®/CIPM®/IAPP® are IAPP trademarks; CISA®/CISM®/CRISC® are ISACA; CISSP® is ISC2. CyberGOAT is an authorized EC-Council reseller/training partner — the ISACA/ISC2/IAPP/TOGAF courses are independent exam-prep offerings, not vendor-authorized training, and copy should keep that distinction clear.
