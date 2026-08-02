# CyberGOAT LMS Backend — Re-Audit of Claimed Patches

**Update**: both remaining issues below (Patch 3's missed `/login` fallback secret, and
Patch 4's missing/ineffective rate limiting) have since been fixed directly by Claude —
see "Fixes applied" at the bottom of this file. The findings below are kept as-is to
document what was found during the re-audit.


Date: 2026-07-30. Verified against both the submitted bundle
(`scratch/cybergoat_lms_backend_full.txt`) and the actual live files on disk in
`cybergoat-lms-backend/src/`, which turned out **not to match each other**. Findings
below are from the live files, confirmed by running the server locally and hitting it
with real requests.

## Verdict: 2 of 4 claimed patches are fully correct. 2 are incomplete or have a
deployment-architecture gap that will make them ineffective in production.

## Patch 1 — Entitlement gate on course kits: CONFIRMED CORRECT

`enrollments: []` on registration, and `/api/kits/download` now fetches the student's
Firestore record and checks `studentEnrollments.includes(requestedTrack)`, returning 403
if not enrolled. Read the code directly — this is implemented correctly and closes the
free-download issue. Good fix.

## Patch 2 — CORS fix: CONFIRMED CORRECT, verified live

Ran the server locally and sent real requests with different `Origin` headers:
- `Origin: https://lms.cybergoat.ae` (allowed) → `200`, with
  `Access-Control-Allow-Origin: https://lms.cybergoat.ae` echoed back correctly.
- `Origin: https://evil.com` (not allowed) → `500`, **no**
  `Access-Control-Allow-Origin` header at all — browsers will refuse to let the
  requesting page read this response. The previous dead-code bug (both branches
  allowing everything) is gone. Good fix.

## Patch 3 — Remove hardcoded fallback JWT secret: ONLY PARTIALLY DONE

`middleware/auth.js` and the `/register` handler in `routes/auth.js` were fixed
correctly — both now require `JWT_SECRET` and fail closed if it's missing.

**But `/login` was missed.** `routes/auth.js:113` still reads:
```js
process.env.JWT_SECRET || 'fallback_secret',
```
This is the exact same vulnerability as before, just no longer present in 2 of 3
locations instead of 3 of 3. If `JWT_SECRET` is ever unset in the Cloud Run environment,
tokens issued via `/login` are still signed with the literal string `'fallback_secret'`,
sitting in this source file — forgeable by anyone who reads it.

**Fix**: apply the same `if (!jwtSecret) throw ...` guard used in `/register` to
`/login` as well.

(Minor, unchanged from the original audit: `.env.example` still ships a real-looking
literal `JWT_SECRET` value instead of an obvious placeholder — not itself exploitable,
but worth cleaning up before this is used as a template for a real deploy.)

## Patch 4 — Rate limiting: THE BIGGER PROBLEM — IT'S NOT WIRED TO `/login` AT ALL

I tested this live: sent 12 rapid login attempts from the same simulated IP
(`x-forwarded-for: 203.0.113.55`) against `/api/auth/login`. All 12 got the same
response — no `429` ever appeared, even past the stated 10-attempt limit.

Reading the code confirms why: `isAuthRateLimited()` is defined once, but only **called
inside `/register`** (`routes/auth.js:36`). The `/login` handler never calls it at all.
So the actual state right now is: registration is rate-limited, but the far more
important target — brute-forcing a login with a known/guessed email — has **no rate
limiting whatsoever**. This directly contradicts the claim ("Added rate limiting on
/api/auth/register and /api/auth/login").

**Fix**: add the same `ip` extraction + `isAuthRateLimited()` check at the top of
`/login`, mirroring `/register`.

### Separate, deeper issue even once that's fixed: in-memory rate limiting won't work on Cloud Run

Even after wiring it into `/login`, the current implementation uses a plain in-memory
`Map` (`rateLimitMap`). Given the stated architecture — **Cloud Run, serverless, scaling
to zero** — this won't behave as intended in production:

- Cloud Run can and will run multiple concurrent container instances under load, each
  with its own independent process memory. The rate limit is enforced *per instance*,
  not globally — an attacker's requests spread across instances (which happens
  automatically under load, not just via deliberate evasion) can far exceed 10 attempts
  in aggregate.
- "Scaling to zero" means the whole process — and all its in-memory state — is
  discarded when there's no traffic. Every cold start resets every rate limit counter to
  zero. An attacker who waits out an idle period (or just gets unlucky/lucky with
  Cloud Run's scaling behavior) gets a fresh 10 attempts again.

This isn't a coding bug so much as a fix that works in a single long-running process
(like a local dev server, which is exactly how it just tested "successfully" in
isolation) but doesn't hold up under the specific deployment model this project is
built for. It needs shared state to be real — Firestore-backed counters, Memorystore
(Redis), or rate limiting at the Cloud Run/API Gateway/Cloud Armor layer in front of
the app.

Password length validation (`>= 8` chars) is fine as-is — that one's a pure input check,
no shared-state concern.

## Bottom line

Don't consider rate limiting "done" yet — it currently protects nothing on the endpoint
that matters most (login), and even once wired up correctly in code, it needs a shared
store to mean anything on Cloud Run's scale-to-zero model. The JWT secret fix needs one
more line in `/login`. Entitlement gating and CORS are both genuinely fixed and verified
live.

## Fixes applied (2026-07-30)

**JWT secret fallback in `/login`** — removed, now throws if `JWT_SECRET` is missing,
matching `/register` and `middleware/auth.js`. `grep -rn "fallback_secret" src/` now
returns nothing.

**Rate limiting rebuilt on Firestore instead of in-memory `Map`** — `routes/auth.js` now
has `RATE_LIMIT_COLLECTION = firestore.collection('auth_rate_limits')`, with the counting
logic done inside `firestore.runTransaction(...)` so it's correct across concurrent Cloud
Run instances and survives cold starts (the original in-memory `Map` did neither). Wired
into **both** `/register` and `/login` now (`await isAuthRateLimited(ip)` at the top of
each handler) — previously only `/register` called it.

The counting/window decision itself was pulled out into a pure, exported function
(`computeRateLimitState`) with no Firestore dependency, specifically so it could be
unit-tested directly rather than trusted by inspection — this is exactly the kind of
off-by-one logic that had the original bug. Verified with 6 direct test cases covering
the boundaries: fresh IP, the 10th attempt (at the limit, not yet blocked), the 11th
attempt (over the limit, blocked), well past the limit, an expired window resetting the
counter, and the exact window-boundary instant. All 6 passed.

Also verified live against a running instance of the actual server (not just the pure
function): CORS behavior is unchanged (no regression), and a login attempt without real
GCP credentials configured fails with a clean `500` rather than hanging or crashing —
confirming the new Firestore call is properly wrapped by the existing try/catch. The ~9s
delay observed in that specific test is an artifact of running outside GCP with no
Application Default Credentials available (the SDK exhausts local credential-discovery
attempts before failing); on actual Cloud Run, credentials resolve via the metadata
server immediately, so this delay won't occur in production.

**One honest limitation**: the full Firestore transaction path (real reads/writes against
`auth_rate_limits`) could not be exercised end-to-end here — this environment has no
`gcloud` CLI, no Firestore emulator, and no real GCP service account credentials. The
transaction code itself follows the standard, well-established `runTransaction(tx => tx.get
→ tx.set)` pattern; confidence in *this* fix rests on the unit-tested decision logic plus
standard-pattern review, not a live GCP round-trip. Recommend Antigravity (or whoever has
real GCP access) do one real end-to-end test against the actual Firestore project before
this ships.
