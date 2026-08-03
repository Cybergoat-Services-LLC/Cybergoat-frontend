# Handoff to Antigravity — 2026-08-03

**This supersedes `HANDOFF_TO_ANTIGRAVITY_2026-08-02.md` and the older undated one.** Those are now stale enough to be actively misleading — a huge amount changed since. Don't reference them for current state; this document reflects verified reality as of today. If you (or a future session) find yourself unsure whether something described here is still true, re-verify against actual code/config/live infrastructure rather than trusting prose — that's the methodology this whole engagement has run on, and it's caught real bugs every time it's been applied.

## One-line status

The old backend is fully decommissioned. The new Laravel LMS backend and the new student portal are both live in production, verified end-to-end, and all third-party integrations (GCS, Vertex AI, Google Sheets, Google Calendar, Stripe) are wired and confirmed working with real test transactions — not just configured, actually tested. The only thing left before the store is fully usable by real customers is **real course pricing data**, which only the client can provide (see "Open items" below).

---

## 1. What exists now — architecture

**Backend** — Laravel 12, its own repo, its own Cloud Run service:
- Repo: `github.com/Cybergoat-Services-LLC/cybergoat-lms` (separate from the frontend repo — do not confuse with the old `Cybergoat--backend` repo, which no longer exists, see decommission section)
- Local path: `C:\Users\khati\.gemini\antigravity\scratch\cybergoat-laravel-lms`
- Deployed: Cloud Run service `cybergoat-lms`, project `gen-lang-client-0992165942`, region `us-central1`
- Live URL: `https://cybergoat-lms-32wnplyecq-uc.a.run.app`
- API base path: `/api/v1/...` — this is a JSON API only, no HTML pages (Filament admin panel at `/admin` is the one exception, real server-rendered UI for staff)

**Frontend** — Next.js 16, existing repo, existing Vercel project (this was already the setup before this session; nothing new here architecturally, just new pages added to it):
- Repo: `github.com/Cybergoat-Services-LLC/Cybergoat-frontend`
- Local path: `C:\Users\khati\.gemini\antigravity\scratch`
- Deployed on Vercel, project `cybergoat-frontend`, live at `www.cybergoat.ae`
- The student portal (`/login`, `/register`, `/dashboard`) is new this session and lives here, calling the Laravel API above via server-only route handlers under `src/app/api/portal/*`

**Why two platforms:** Laravel is PHP; Vercel doesn't run PHP the way Cloud Run does. Each half lives where its language actually runs. Not a design choice made lightly — just following the grain of the stack.

**Domain state:**
- `www.cybergoat.ae` → Vercel → the frontend above (real login page is here)
- `lms.cybergoat.ae` → now an A record to Vercel (`76.76.21.21`), 301-redirects to `https://www.cybergoat.ae/login` via `src/proxy.ts` (this is Next.js 16's renamed `middleware.ts` convention — if you ever see a `middleware.ts` file reappear, that's a regression, it should be `proxy.ts`)
- The old backend no longer has any domain mapping at all — it doesn't exist anymore (see below)

## 2. Old backend — fully decommissioned, not just deprecated

Everything below was verified gone as of today, not just "should be gone":
- Cloud Run service `cybergoat--backend` — deleted
- Cloud Run job `migrate-cybergoat-db` — deleted
- Domain mapping `lms.cybergoat.ae` → old service — deleted
- Cloud Build trigger (the one that used to auto-deploy the old repo on every push — this was flagged early in the engagement as "any AI push redeploys the old broken LMS," that risk is now fully closed) — deleted
- GitHub repo `Cybergoat-Services-LLC/Cybergoat--backend` — deleted (confirmed 404)
- Old Cloud SQL **database** `cybergoat_lms` and its user `cybergoat_app` — deleted (verified only 13 rows of generic template config existed, zero real business data lost)

**Important nuance:** the Cloud SQL **instance** `cybergoat-db` itself was NOT deleted — it's still running and now hosts the *new* backend's live database (`cybergoat_lms_laravel`), on a shared instance to avoid a second Cloud SQL bill. If anyone ever proposes "let's clean up `cybergoat-db`," stop and check what's actually in it first — it's not old-backend-only anymore.

## 3. New backend — what's built (all covered by passing tests, `php artisan test`: 113 passed, 0 failures as of today)

Auth (Sanctum bearer tokens, not session-based): register/login/logout/me, rate-limited on the public endpoints. Courses, Enrollments, KitDownloads with real GCS V4 signed URLs, LiveClasses with real Google Calendar/Meet integration, Coupons, course bundling, Certificates (3 types), external bonus resources, Wishlist, AI-generated quizzes via Vertex AI, AI content generator, Stripe checkout + webhook + offline bank/Aani payment with admin confirmation, VAT/business Settings, Invoices, Filament admin panel at `/admin` (role=admin only). Cascade-delete protection via FK `restrict` on financial/credential records (a real data-loss bug from an earlier audit, now fixed and regression-tested).

Dashboard endpoint (`GET /v1/dashboard`) returns real stats only — no fabricated completion percentages. Quiz average is best-score-per-quiz averaged across distinct quizzes, not a raw average (a real bug caught mid-session: a retake while still learning shouldn't drag the score down).

## 4. New frontend — student portal (new this session)

`/login`, `/register`, `/dashboard` — real email/password auth against the Laravel API, matching the site's existing dark/glass visual design. The auth token lives in an **httpOnly cookie** set by server-only route handlers (`src/app/api/portal/login|register|logout/route.ts`) — client-side JS can never read it, verified by grep (no `document.cookie` reads anywhere) and by checking no response body ever includes the raw token.

**A real security risk was checked and confirmed absent:** early in this engagement, a NextAuth-to-Sanctum "bridge" design was proposed that would have let anyone POST an arbitrary email and get a valid token for that account — full account takeover, no password needed. It was flagged immediately and never built. Re-verified today via full codebase search — nothing resembling it exists. If anyone (AI or human) proposes wiring up the "Continue with Google/LinkedIn" buttons in `SignInModal.tsx` to actually do something (they currently just redirect to `/login`, they don't perform real OAuth), **do not** implement it as "frontend tells backend which email just logged in" — that's the exact vulnerability. Any real Google/LinkedIn login must have the backend independently verify the OAuth token with Google/LinkedIn itself, never trust a client-asserted email.

## 5. Infrastructure — GCP resources (project `gen-lang-client-0992165942`, region `us-central1` throughout)

| Resource | State |
|---|---|
| Cloud Run service `cybergoat-lms` | Live, serving 100% of traffic |
| Cloud Run job `migrate-cybergoat-lms` | For running `php artisan migrate --force` against prod — use this pattern, don't run migrate from a live request |
| Cloud SQL `cybergoat-db` instance | Live, MySQL 8.4, hosts database `cybergoat_lms_laravel` |
| Service account `cybergoat-lms@gen-lang-client-0992165942.iam.gserviceaccount.com` | Scoped to `roles/aiplatform.user` (project), `roles/storage.objectAdmin` (bucket-scoped to `cybergoat-course-kits-prod` only), `roles/cloudsql.client` (project) |
| GCS bucket `cybergoat-course-kits-prod` | Course kit downloads |
| Secret Manager | `cybergoat-lms-db-password`, `cybergoat-lms-app-key`, `cybergoat-lms-gcp-key`, `cybergoat-lms-stripe-secret`, `cybergoat-lms-stripe-webhook-secret` — all access-scoped to only the `cybergoat-lms` service account |
| Public access | This org has a domain-restricted-sharing policy that blocks the normal `allUsers` invoker binding. Public access is achieved via `--no-invoker-iam-check` (matches how the old backend did it too) — if a future redeploy ever "loses" public access, this is why, and this is the fix |

**Docker/deployment gotchas already solved, don't rediscover them:**
- OPcache must be explicitly enabled and tuned (`docker/opcache.ini`) — installing the extension isn't enough, it defaults to off, and without it every request recompiles the entire Laravel+Filament tree (~1-3s instead of ~0.5s)
- `docker/entrypoint.sh` does an internal warm-up request before real traffic can reach the app, to absorb the unavoidable first-compile cost on cold starts
- Don't `apt-get purge` the `-dev` packages after building PHP extensions in the same layer — it removes the runtime shared libraries (`libpng`, `libzip`) the extensions need to load, not just the build headers
- `.dockerignore` excludes `.env` and `storage/gcp-key.json` — verify this stays true if the Dockerfile ever changes, those must never end up baked into an image

## 6. Real integrations — all verified working today, not just configured

- **Google Cloud Storage** (signed URLs for kit downloads) — verified
- **Vertex AI** (quiz generation, content generator) — verified, real OAuth token acquired
- **Google Sheets sync** — verified with a real sync against spreadsheet ID `1u8fv0_MHznIyKhGnec5DicAc2hoG_8AX-PhtOMHcC3c` (owned by the client, shared with the service account as Editor). Note: a brand-new Google Sheet doesn't have the tabs the sync code expects (`Enrollments`, `Invoices`, `Certificates`) — these were created via the API as part of setup; if the client ever creates a *replacement* spreadsheet, those three tabs need creating again before sync will work.
- **Google Calendar domain-wide delegation** — verified, real access token acquired for `admin@cybergoat.ae` (this is the impersonation email — Meet links get created on this calendar)
- **Stripe** — verified with a real live Checkout Session creation (`checkout.sessions.create`) and a real validly-signed test webhook delivered to the live endpoint. Key is a **restricted key** scoped to `Checkout Sessions: Write` only — deliberately least-privilege, cannot touch refunds, payouts, customers, or bank settings. Webhook endpoint: `https://cybergoat-lms-32wnplyecq-uc.a.run.app/api/v1/webhooks/stripe`, listening only to `checkout.session.completed`.

**This account is LIVE mode, not test mode.** Any test transactions run against it are real Stripe API calls (though harmless — a Checkout Session that nobody pays just expires after 24h, no money moves). Be deliberate about what gets tested against it going forward.

## 7. Open items — genuinely still pending

1. **Real course pricing, bundle, coupon data.** The 6 real courses (CEH v12, CHFI v11, C|CISO, CISA, CISM, CISSP) are seeded with real titles/descriptions but `price = 0` on all of them. **Checkout is explicitly blocked in code** if price is 0 ("This course does not have a price set yet") — so nothing is broken, but nobody can actually buy anything until real prices are set. This needs real numbers from the client — do not invent placeholder prices.
2. That's it. Calendar delegation, Sheets, and Stripe were all still-open items as of this morning and are now closed and verified.

## 8. Handling secrets / credentials in this project

Never write actual secret *values* into any file that gets committed or into a handoff doc like this one — only reference *where* they live (Secret Manager secret names, as above). A GitHub Personal Access Token was used this session for repo creation/deletion/pushes (scopes: `repo`, `delete_repo`) — it's still active as of this handoff (client chose to keep it rather than revoke immediately; a reminder is scheduled for 2026-08-05 to prompt revocation). If you need GitHub access and don't have it, ask the client rather than assuming a token is available — don't go looking for one in shell history or env files.

## 9. Working alongside another AI (division of labor, the actual fix for past friction)

Earlier in this engagement, Claude and Antigravity editing the same live files concurrently caused a real bug (a Fast-Refresh race). The fix isn't a live technical bridge between the two tools — there isn't one — it's this: before starting multi-file work on either the frontend or backend repo, check recent git log / working tree state first, and if something looks mid-edit or unfamiliar, ask the client before proceeding rather than guessing. This handoff doc is the other half of that fix — keep it (or the next one) actually current rather than letting it drift, since a stale handoff is worse than no handoff.
