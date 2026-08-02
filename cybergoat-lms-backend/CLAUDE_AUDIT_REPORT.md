# CyberGOAT LMS Backend Audit (Express + Firestore + Cloud Run)

Date: 2026-07-30. All 7 files in scope were read in full: `package.json`, `.env.example`,
`src/server.js`, `src/middleware/auth.js`, `src/routes/auth.js`, `src/routes/kits.js`,
`src/routes/progress.js`.

## Verdict: not deployment-ready. One business-critical bug, one critical security bug.

## Critical

### 1. Anyone can get the paid course kits for free — there is no purchase gate at all

`src/routes/auth.js:32`:
```js
enrollments: ['chfi', 'cciso'], // Default access or dynamic upon purchase
```
Every new registration — with any email, any password, no payment, no verification —
gets `enrollments: ['chfi', 'cciso']` by default. The comment itself admits this is a
placeholder ("or dynamic upon purchase") for logic that was never built.

It gets worse in `src/routes/kits.js`: the `/download` route only checks
`authenticateToken` (is this *a* valid logged-in user) — it never checks whether the
requesting user is actually enrolled in the requested `track`. It can't even check,
because the JWT payload (`{ email, fullName }` in `auth.js:38-42`) doesn't carry
`enrollments` at all, and the route never re-fetches the student's Firestore doc to
verify entitlement.

**Net effect**: `POST /api/auth/register` with throwaway data → `GET
/api/kits/download?track=chfi` → a real signed download URL for the actual CHFI course
kit ZIP, for free, in two requests, with zero payment involved. Same for `cciso`. This is
a direct, unlimited leak of the paid product, not a hardening gap.

**Fix**: `enrollments` should default to `[]` on registration. `/api/kits/download` must
check the *current* Firestore record for that email and confirm `track` is in
`enrollments` before generating a signed URL — not just that the JWT is valid.

### 2. CORS origin check is dead code — every origin is allowed

`src/server.js:21-30`:
```js
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev origins
    }
  },
  credentials: true
}));
```
Both branches call `callback(null, true)`. The `allowedOrigins` allowlist and the
`.vercel.app` check are built but never actually gate anything — every request, from any
origin, is allowed, and with `cors`'s dynamic-origin mode that means the responding
`Access-Control-Allow-Origin` header reflects whatever `Origin` the requester sent, which
browsers accept even with `credentials: true`. Combined with credentials mode enabled,
this is a real cross-origin request forgery surface — any website can make credentialed
requests against this API from a visitor's browser.

Also worth asking: this API uses Bearer tokens (`Authorization` header), not cookies —
`credentials: true` in CORS only matters for cookie/HTTP-auth flows. Unless there's a
cookie-based flow elsewhere not in this bundle, it should likely be removed entirely, and
the origin check fixed to actually reject non-matching origins regardless.

**Fix**: change the `else` branch to `callback(new Error('Not allowed by CORS'))`, and
drop `credentials: true` unless cookies are genuinely in use.

## High

### 3. Hardcoded fallback JWT secret, in two places

`src/middleware/auth.js:11` and `src/routes/auth.js:40,80`: all three use
`process.env.JWT_SECRET || 'fallback_secret'`. If `JWT_SECRET` is ever unset on Cloud Run
(e.g. a deploy config slip), every token gets signed and verified with the literal string
`'fallback_secret'` — which is sitting in this source file for anyone with repo access to
read. Anyone who knows it can forge a valid session for any email address.

Separately: `.env.example:2` ships a real-looking literal value —
`JWT_SECRET="cybergoat_super_secret_jwt_key_2026"` — not an obvious placeholder like
`your_jwt_secret_here`. If a real deploy ever copies `.env.example` → `.env` without
changing it, that's a second guessable, publicly-visible secret in play.

**Fix**: remove the `|| 'fallback_secret'` fallbacks — let the app fail to start if
`JWT_SECRET` isn't set, don't fail open into a public default. Replace the example value
with an obvious placeholder.

### 4. No rate limiting on `/register` or `/login`

Nothing in `package.json` (`express-rate-limit`, etc.) or `server.js` limits request
volume. Combined with finding #5 below, this is an open door for credential stuffing and
brute-force login attempts.

## Medium

### 5. No password strength validation

`src/routes/auth.js:18`: only checks `!password` (truthy). A password of `"a"` is
accepted, bcrypt-hashed, and stored. Given accounts (per #1) get default course-kit
access, weak passwords make account takeover trivial.

### 6. Email enumeration on registration

`src/routes/auth.js:24`: `"Student email is already registered."` directly confirms
whether an email exists in the system. (Login's error message is already uniform —
`"Invalid email or password"` — good practice there; registration doesn't follow it.)

### 7. No email verification

Anyone can register using an email address they don't own — there's no verification step
before the account is live and (per #1) has course-kit access.

### 8. No input validation on progress data

`src/routes/progress.js:15`: `completedModules` and `quizScores` are written to
Firestore straight from `req.body` with no type or shape checking. Low exploitability
(Firestore's 1MB doc limit is a natural backstop, and the doc ID is derived from the
verified JWT email, not client input — that part's done correctly), but worth adding
basic shape validation.

## What's solid

- `src/routes/progress.js` correctly uses `req.user.email` (from the verified JWT) as the
  identity for Firestore doc IDs, not a client-supplied value — this is the right pattern
  and avoids a common "trust the body" mistake.
- Signed URL generation in `kits.js` uses an object-lookup allowlist
  (`COURSE_KITS[track]`) rather than interpolating the query param into a file path — no
  path traversal.
- The "V4 signed URL, 60-minute expiry" claim checks out exactly as described
  (`version: 'v4'`, `expires: Date.now() + 60*60*1000`).
- Passwords are hashed with bcrypt at a reasonable cost factor (10).
- Login's error message doesn't leak whether the email or the password was wrong.

## Bottom line

Fix #1 and #2 before this goes anywhere near production — #1 in particular means the
actual paid product has no gate on it at all right now. #3 and #4 are the next priority.
The rest are real but lower-urgency hardening items.
