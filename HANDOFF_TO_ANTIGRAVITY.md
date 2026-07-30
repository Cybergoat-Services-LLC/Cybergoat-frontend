# Security Fixes Applied by Claude — Handoff to Antigravity/Gemini

Following up on the technical audit Claude ran (see `CLAUDE_AUDIT_REPORT.md`). Two
critical, live-exploitable vulnerabilities have been fixed and verified. This doc lists
what changed, the full vulnerability list (resolved + still open), and recommendations
for what Antigravity should pick up next.

## Vulnerabilities faced

| # | Severity | Issue | Status |
|---|---|---|---|
| 1 | **Critical** | Auth bypass: `authorize()` only checked `password.length >= 6`, no real credential verification — any email + any 6-char string got a valid signed session | **Fixed** |
| 2 | **Critical** | `/api/knowledge` (POST/DELETE) had zero auth check — any anonymous request could rewrite what the public AI chatbot tells customers. Proved live with a plain `curl` from outside the app. | **Fixed** |
| 3 | **High** | Hardcoded fallback JWT secret (`'cybergoat_default_secret_key_2026'`) if `NEXTAUTH_SECRET` was ever unset in production | **Fixed** |
| 4 | Medium | `/api/chat` has no rate limiting — open endpoint hitting a paid Gemini API key | **Open** |
| 5 | Medium | Knowledge base persists via `fs.writeFileSync` to a JSON file — Vercel's serverless filesystem is read-only outside `/tmp`, so this will silently fail to persist in production | **Open** |
| 6 | Info | `npm audit` shows 9 high-severity vulnerabilities (CVE-2026-33327/33328/35590/35591 in `sharp`, PostCSS path traversal) nested inside Next.js's own `node_modules` — not fixable at the project-dependency level | **Open / upstream** |
| 7 | Info | Audit request described the stack as "Auth.js v5" — `package.json` actually pins `next-auth: ^4.24.15` (v4) | **Documentation mismatch, not a bug** |

## What was changed (code)

**`src/app/lib/authOptions.ts`** — credentials provider now always rejects (no real user
store exists to check against), and the hardcoded secret fallback is gone:
```ts
async authorize() {
  // Credentials login is intentionally disabled: there is no real student
  // account store to verify against yet (LMS integration is not wired up).
  return null;
},
// ...
secret: process.env.NEXTAUTH_SECRET, // no more `|| 'hardcoded_default'`
```

**`src/app/components/SignInModal.tsx`** — removed the fake email/password form
entirely (it could never legitimately succeed now), replaced with the honest pattern:
Google/LinkedIn buttons linking straight to the real, working `lms.cybergoat.ae/login`.

**`src/app/api/knowledge/route.ts`** — every method now requires a matching admin key:
```ts
function isAuthorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;
  return req.headers.get('x-admin-key') === adminKey;
}
// applied to GET, POST, and DELETE — all return 401 without it
```

**`src/app/components/ChatbotTrainingModal.tsx`** — the modal (opened via the ⚙️ gear
icon, visible to every site visitor) now shows an "Admin Access Required" key-entry
screen and won't fetch or display any Q&A data until unlocked. Key is remembered for the
browser session via `sessionStorage`.

**`.env.local` / `.env.example`** — added `ADMIN_API_KEY` (a fresh random value is set
locally; needs to also be set as a Vercel production env var before this ships).

All of this was verified live against the running dev server, not just read from source:
a forged credentials login now returns `401 CredentialsSignin` with an empty session
(previously it succeeded), and an unauthenticated `curl -X POST` against `/api/knowledge`
now returns `401` (previously it wrote real data into the live knowledge base).

## Recommendations for Antigravity

1. **Add rate limiting to `/api/chat`.** Even a basic per-IP in-memory limiter is better
   than nothing — it's currently open to anyone and calls a paid Gemini API key per
   request.
2. **Replace the knowledge-base storage before relying on it in production.** The
   `fs.writeFileSync` approach in `lib/knowledge.ts` won't persist on Vercel. Options:
   Vercel KV, a small Postgres/SQLite instance, or point it at the existing Laravel
   backend that's already running real data for courses/categories.
3. **Set `ADMIN_API_KEY` and `NEXTAUTH_SECRET` as real Vercel production env vars**, not
   just in `.env.local` — check this before the next deploy.
4. **Don't run `npm audit fix --force`** to chase the 9 remaining vulnerabilities — it
   wants to downgrade Next.js to `9.3.3`, a massive breaking regression. These are nested
   in Next.js's own dependency tree and need an upstream Next.js patch release; track them,
   don't force-fix them.
5. **If real student login is needed**, build the NextAuth credentials provider against
   an actual user store (or drop it and rely solely on redirecting to the real LMS, which
   already has real auth) — don't reintroduce a local check that isn't backed by a real
   database.
