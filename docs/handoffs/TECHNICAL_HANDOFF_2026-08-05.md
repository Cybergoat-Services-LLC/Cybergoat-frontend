# Technical Handoff — 2026-08-05

Companion to `HANDOFF_TO_ANTIGRAVITY_2026-08-05.md`. That one is status; this one is implementation detail — read it before touching code in either repo.

---

## 1. File-by-file map of everything changed this round

### Frontend (`Cybergoat-frontend`, local path `C:\Users\khati\.gemini\antigravity\scratch`)

| File | What changed | Why |
|---|---|---|
| `src/app/components/Modal.tsx` | Split one `useEffect` (Escape-key + body-scroll-lock + focus-steal, deps `[isOpen, onClose]`) into two — focus now only happens in its own effect with deps `[isOpen]` | `onClose` is a fresh function reference every parent render; including it in a dep array that also calls `.focus()` meant any keystroke in a form inside the modal re-ran the effect and yanked focus back, breaking typing after the first character. Affects every modal built on this shared wrapper. |
| `src/app/lib/logout.ts` (new) | `fullLogout(callbackUrl)` — POSTs `/api/portal/logout` then calls NextAuth's `signOut()` | Two independent session cookies (NextAuth's, and the Sanctum `portal_token`) need clearing together. Neither `SignInModal.tsx` nor `dashboard/LogoutButton.tsx` did both before. |
| `src/app/components/SignInModal.tsx` | Sign Out button now calls `fullLogout()` instead of NextAuth's `signOut()` directly | See above. |
| `src/app/dashboard/LogoutButton.tsx` | Sign Out now calls `fullLogout('/')` instead of only `fetch('/api/portal/logout')` | See above. |
| `src/app/lib/mailer.ts` (new) | `sendMail()` (Gmail SMTP via `nodemailer`) + `escapeHtml()` | Enrollment/B2B lead notifications. `escapeHtml` exists because free-text form input gets interpolated into email HTML — see the leads route below. |
| `src/app/api/leads/route.ts` | Now handles both track-based and B2B leads (discriminated by `body.type === 'b2b'`), escapes all interpolated fields via `escapeHtml()`, sends a notification email (awaited, not fire-and-forget — see §2), rate-limits the admin `GET` the same as the public `POST` | B2B form was sending a payload the endpoint could never accept (see below); email HTML was unescaped; admin endpoint had no rate limit at all. |
| `src/app/lib/leads.ts` | `TrackLead` type gained `type: 'track' \| 'b2b'`, `companyName?`, `details?` | Support the B2B lead shape without a separate storage path. |
| `src/app/components/CorporateB2BSection.tsx` | Sends `type: 'b2b'` instead of a free-text `type` string the API never checked for; now checks `res.ok` before showing the success screen, shows a real error otherwise | **Root cause of the biggest bug found this round**: the form never sent `stageKey`, which `/api/leads` always required — every submission got a 400. The client-side `try/catch` called `setSubmitted(true)` in *both* branches, so the visitor always saw "Proposal Request Received" regardless. Every corporate inquiry was silently dropped. |
| `src/app/api/knowledge/route.ts` | Added the same IP rate-limit pattern as `/api/leads` to `GET`/`POST`/`DELETE` | Was the only admin-key-gated surface with zero throttling. |
| `src/app/components/ChatbotTrainingModal.tsx` | Added a `verified` state; the unlocked admin panel now only renders after a confirmed non-401/200 response, not synchronously on keypress | Previously rendered the full admin UI (with stale/empty data) immediately on `handleUnlock`, before the server had validated the key — including on a *wrong* key, which flashed through before snapping back. |
| `src/app/admin/leads/page.tsx`, `src/app/admin/training/page.tsx` | `fetchLeads`/`fetchQAs` now check `res.ok` before treating the response as valid data; a non-401 failure (e.g. Redis outage) now shows a real error instead of silently rendering "0 items" | Previously only special-cased 401; any other failure fell through to `data.leads \|\| []` → empty array with `isUnlocked(true)` and no error shown. |

### Backend (`cybergoat-lms`, local path `C:\Users\khati\.gemini\antigravity\scratch\cybergoat-laravel-lms`)

| File | What changed | Why |
|---|---|---|
| `app/Models/Coupon.php` | `redeem()` (plain `increment()`) replaced with `tryRedeem(): bool` — single atomic `UPDATE ... WHERE uses_count < max_uses` via `whereColumn()`. Added `release()` (atomic decrement, floored at 0). | `isValid()` (read) and the old `redeem()` (write) were two separate round trips — two concurrent requests for a single-use coupon's last slot could both pass the read and both redeem. The atomic conditional `UPDATE` makes the DB itself the serialization point, not app code. |
| `app/Models/Invoice.php` | `draftForCourse()`: coupon redemption now happens via `tryRedeem()` **before** the invoice row is created (previously: created invoice, then unconditionally called `redeem()` after). `markPaidAndEnroll()`: now wraps in `DB::transaction()` with `lockForUpdate()` on the invoice row. | First change closes the actual race (a lost race now throws before any invoice exists, instead of leaving an orphaned discounted invoice). Second change: Stripe delivers webhooks at-least-once and can send duplicates for the same event; without the lock, two near-simultaneous calls could both read `payment_status='pending'` before either commits. |
| `app/Console/Commands/ReleaseAbandonedCoupons.php` (new) | New scheduled command (`app:release-abandoned-coupons`, hourly via `routes/console.php`). Finds `pending` invoices with a `coupon_code` and `created_at` older than 24h, releases the coupon slot, flips `payment_status` to `failed`. | A coupon was being consumed the moment checkout *started*, not when payment completed. Nothing released it if the customer abandoned checkout — repeated abandonment could exhaust a promo code's entire allotment with zero completed payments. 24h chosen because Stripe Checkout sessions expire in that window anyway. Reuses the existing `failed` enum value (`payment_status` is a strict DB enum: `pending/paid/failed/refunded` — don't introduce a new string value without a migration). |
| `app/Http/Controllers/Api/DashboardController.php` | Added a separate `$activeCourseIds` (status=`active` AND not expired) used **only** for the `upcoming_live_classes` query. Course history/progress/certificates still use every enrollment ever, unchanged. | Was the only enrollment-gated surface in the app with no active/expiry check — `CourseController`, `QuizController`, `KitController` all correctly gate on `status='active' AND (expires_at IS NULL OR expires_at > now())`. A lapsed enrollment could still pull a real, joinable Google Meet link via the dashboard. |
| `tests/Feature/BundlingAndCouponsTest.php`, `tests/Feature/DashboardTest.php` | 5 new regression tests for the above (concurrent redemption, abandoned-coupon release ×3, dashboard leak) | — |

**Full suite: 131 passing (126 pre-existing + 5 new), 0 failures**, as of `ed1efb1`.

---

## 2. Patterns established this round — follow these, don't reinvent

- **Atomic conditional UPDATE for check-and-consume races** (`Coupon::tryRedeem()`): `Model::where(...)->whereColumn('a', '<', 'b')->increment('a')` returns the number of affected rows — 0 means the condition failed atomically at write time. This is the pattern for anything with a "consume a limited resource" shape; don't reach for `lockForUpdate()` unless you specifically need to read-then-conditionally-write *multiple* things in the same transaction (see `markPaidAndEnroll` for that case instead).
- **Row-lock + transaction for idempotent multi-step writes** (`Invoice::markPaidAndEnroll()`): wrap in `DB::transaction()`, `lockForUpdate()` the row first thing inside it, re-check the guard condition against the *locked* read, not `$this`'s possibly-stale in-memory state.
- **Awaited (not fire-and-forget) side effects in Next.js Route Handlers**: `sendMail()` in `/api/leads` is `await`ed even though its result is never checked. On Vercel's serverless runtime, an un-awaited promise can be torn down the moment the response returns — there's no guarantee it finishes. If a side effect must happen, await it, even if you don't care about its return value.
- **`escapeHtml()` before any user-submitted string goes into email HTML.** Applies to every field on every lead-notification path, not just the ones touched this round — check `mailer.ts`'s `escapeHtml` export before adding any new email template.
- **`isRateLimited(namespace, ip, max, windowSeconds)` from `src/app/lib/rateLimit.ts`** is the house pattern for any endpoint reachable without a real auth check (a shared-secret header counts as "without a real auth check" for this purpose — see `/api/knowledge` and `/api/leads` GET, both now rate-limited even though they also require `ADMIN_API_KEY`).
- **Admin-panel unlock gates on a `verified` boolean set only after a confirmed server response, never on the mere presence of a key value** (`ChatbotTrainingModal.tsx`, and the pre-existing pattern in `admin/leads/page.tsx` / `admin/training/page.tsx`). Don't render privileged UI optimistically.
- **`fullLogout()` from `src/app/lib/logout.ts` is the only correct way to sign a user out anywhere in this app.** Never call NextAuth's `signOut()` or hit `/api/portal/logout` directly and separately — grep for `signOut(` before adding a new logout entry point; there should only ever be one caller of it (`logout.ts` itself).

## 3. Deploy commands — exact, working, as of this handoff

**Frontend (Vercel):**
```bash
vercel deploy --prod --archive=tgz --yes
```
`--archive=tgz` is required — this repo has >15,000 files, and Vercel's default upload rejects that without it.

**Backend (Cloud Run):**
```bash
gcloud run deploy cybergoat-lms --source . --region=us-central1 --project=gen-lang-client-0992165942
```
Requires an authenticated `gcloud` session (`gcloud auth login`, interactive — cannot be done from a non-interactive shell/agent). If you hit `Reauthentication failed. cannot prompt during non-interactive execution`, that's this — ask the client to run `gcloud auth login` themselves, don't attempt a workaround. Currently deployed revision as of this handoff: `cybergoat-lms-00014-62g`, serving 100% of traffic.

**Pushing to GitHub from an environment without an interactive credential prompt** (git's normal credential manager will hang/fail non-interactively): use a one-off authenticated URL rather than mutating the stored remote:
```bash
git push "https://<token>@github.com/Cybergoat-Services-LLC/<repo>.git" main
```
Do not persist the token into `git remote set-url` — pass it inline per-invocation only.

**Backend tests:**
```bash
php artisan test
```
Run this before every backend deploy. It's fast (~20s) and has caught real regressions before.

## 4. Env var reference (names only — see the main handoff for secret-handling policy)

**Frontend, Vercel, added/relevant this round:**
- `GMAIL_APP_PASSWORD` — Sensitive (write-only)
- `GMAIL_SENDER_EMAIL` — Sensitive (auto-flagged, not actually sensitive in nature — value is `admin@cybergoat.ae`)
- `LEAD_NOTIFICATION_EMAIL` — optional, defaults to `admin@cybergoat.ae` in code if unset
- `ADMIN_API_KEY` — pre-existing, gates `/api/knowledge`, `/api/leads` GET, and both `/admin/*` pages. Marked Sensitive in Vercel — if you ever need the value and can't find it in `.env.local`, it cannot be recovered from Vercel; you'll need to rotate it (generate new, `vercel env add`, and tell the client the old admin-panel value is now stale).

**Backend, Cloud Run env/secrets:** unchanged from the 08-03 handoff — no new ones added this round.

## 5. Specific notes on working alongside Antigravity — observed this round, not theoretical

- **Antigravity's commits use the git identity `Shahzad <shahzad@cybergoat.ae>`** — the same identity the client's own commits use. `git log --author` cannot distinguish an Antigravity commit from a client commit. If you need to know who made a change, read the commit message and diff, not the author field.
- **Antigravity's KHDA-compliance fix touched exactly one of at least 7 files making the same kind of "in-person/campus" claim** (`sections.tsx` only — left `refund-policy/page.tsx`, `CorporateB2BSection.tsx`, the enrollment form's format dropdown, `api/leads/route.ts`'s `VALID_FORMATS`, `api/chat/route.ts`'s chatbot prompt, and `rss.xml/route.ts` all saying the old thing). **Pattern to watch for: a fix that's correct in direction but scoped to only the file currently being looked at.** Before treating any single-file content/wording fix as "done," grep for the same phrase/claim elsewhere before assuming it's been applied consistently.
- **A previous Antigravity proposal (flagged and never built) suggested a social-login bridge design that would trust a client-asserted email with a shared secret** — i.e., the frontend telling the backend "this user is X@gmail.com, trust me," rather than the backend independently re-verifying the OAuth token with Google/LinkedIn itself. This is a full account-takeover vector (anyone who has or guesses the shared secret can become any user). The bridge that actually got built (`SocialAuthController` + `SocialAuthVerifier`, see 08-03 handoff §4) independently re-verifies every token against Google's `tokeninfo` endpoint or LinkedIn's introspection endpoint before ever trusting an email. **Any future proposal that has the frontend assert a user's identity to the backend without the backend independently verifying it against the actual provider is the same bug wearing a different hat — reject it the same way.**
- **Concurrent production deploys happened from both sides during this round** — `vercel ls --prod` showed a deploy under username `shahzad27-5225` land 3 minutes before one of this session's own deploys, both to the same production alias. Nothing broke this time because the changes didn't conflict, but there's no coordination mechanism preventing two different deploys from racing. Before deploying, it's worth a quick `vercel ls <project> --prod` (or `git log` freshness check) to see if something landed very recently that you don't have locally — pull/rebase first if so, rather than deploying over it blind.
