# CyberGOAT Technical Audit — Claude Findings

Date: 2026-07-29. Scope: auth (`authOptions.ts`, `/api/auth/[...nextauth]`), AI chatbot
(`/api/chat`, `/api/knowledge`, `lib/knowledge.ts`, `ChatbotWidget.tsx`,
`ChatbotTrainingModal.tsx`), `SignInModal.tsx`, footer trademark disclaimers, and the
"Verification Evidence" claims in the audit request. Every finding below was verified by
reading the actual code and/or reproducing it against the running dev server — nothing
here is inferred from the spec document alone.

## Verdict: not production-ready. Two critical, exploitable issues block launch.

## Claims in the request vs. what I verified

| Claim | Verdict |
|---|---|
| "NextAuth.js (Auth.js v5)" | **Inaccurate.** `package.json` pins `next-auth: ^4.24.15` (v4). The code uses v4 patterns (`NextAuthOptions`, catch-all route handler) throughout — this is NextAuth v4, not Auth.js v5. |
| `npx tsc --noEmit` → 0 errors | **Confirmed.** Re-ran it myself against `src/`, 0 errors. |
| `GET /`, `GET /api/auth/providers`, `POST /api/chat` → 200 OK | **Confirmed.** Re-ran all three against a fresh dev server, all 200. |
| "49 Dependabot advisories resolved" | **Inaccurate as of now.** `npm audit` currently reports **9 high-severity vulnerabilities**, including real CVEs (CVE-2026-33327/33328/35590/35591 in `sharp`, bundled inside `next`'s own `node_modules`) and a PostCSS path-traversal advisory. Three "security:" commits exist in git history, so work was done — but the vulnerabilities are back or were never fully cleared. Note: `npm audit fix --force` wants to downgrade Next.js to `9.3.3` to "fix" this — **do not run that**, it's a nonsensical fix suggestion for a nested/vendored dependency issue that Next.js itself needs to patch. |
| Trademark disclaimers in footer | **Confirmed.** Present and reasonably thorough (EC-Council®, ISACA®, IAPP®, ISC2® all covered). |
| Privacy courses rebranded as "Exam Prep Masterclasses" | **Confirmed** in `courses-data.ts`. |

## Critical findings

### 1. Authentication is not real — any email + any 6-character string logs in as a valid student

`src/app/lib/authOptions.ts:20`:
```ts
if (password.length >= 6) {
  return { id: 'usr_...', name: ..., email, role: 'student' };
}
```
There is no password check against any user store — only a length check. Anyone can
authenticate as any email address with a real, signed JWT session and `role: 'student'`.
This isn't a hardening gap, it's a complete auth bypass. If anything is ever gated behind
`session.user` (course content, downloads, the LMS handoff), it's wide open today.

**Fix**: this needs a real credential store (hash + verify against a database), or drop
the credentials provider entirely and rely solely on the Google OAuth path shown in the
UI (which isn't actually wired to a Google provider in `authOptions.ts` — the "Continue
with Google Workspace SSO" button just links out to `lms.cybergoat.ae`, it doesn't use
NextAuth's Google provider at all).

### 2. The AI chatbot's knowledge base can be read *and rewritten* by anyone, unauthenticated

`src/app/api/knowledge/route.ts` has no session/auth check on `POST` or `DELETE`. I proved
this live: a plain `curl -X POST` to `/api/knowledge` from outside the app added a fake
Q&A pair, which was immediately live and would be served by "CyberGOAT AI" to real site
visitors as authoritative company information. I deleted my test entry afterward, but
anyone else who finds this endpoint won't.

Compounding it: the ⚙️ gear icon that opens `ChatbotTrainingModal` (the admin UI for this
same API) is visible to **every visitor** in the chat widget header — there's no
`session?.user?.role === 'admin'` check anywhere in that modal or the API route.

**Fix**: gate both the modal (hide unless an authenticated admin session) and the API
route (reject `POST`/`DELETE` unless `getServerSession` shows an admin role) before this
goes anywhere near production. This is the single most urgent fix — it's a live
reputational risk (anyone can put false pricing, false certification claims, or worse
into your official AI assistant's mouth).

### 3. The knowledge base write path will not work on Vercel as deployed

`lib/knowledge.ts` uses `fs.writeFileSync` to persist `qaPairs` to a JSON file under
`process.cwd()/src/app/data/`. Vercel serverless functions have a **read-only,
ephemeral** filesystem outside `/tmp`. In production this will either throw (silently
swallowed by the `try/catch` in `saveKnowledgeBase`, which just `console.error`s) or, if
it doesn't throw, won't persist past that one lambda invocation — every cold start reverts
to whatever was last committed to the repo. The training modal will appear to work
(`POST /api/knowledge` returns `{success:true}` unconditionally, without checking whether
the write actually succeeded) but nothing will actually stick.

**Fix**: this needs a real datastore (even something lightweight — Vercel KV, a hosted
Postgres/SQLite, or point it at the same Laravel backend that already exists) before the
chatbot training feature is claimed as functional on Vercel.

### 4. Hardcoded fallback secret

`authOptions.ts:38`: `secret: process.env.NEXTAUTH_SECRET || 'cybergoat_default_secret_key_2026'`.
`.env.local` does have a real `NEXTAUTH_SECRET` set locally, but if that env var is ever
missing on the actual Vercel deployment, every session gets signed with this
publicly-visible-in-source-code string, which would let anyone forge valid session JWTs.

**Fix**: remove the fallback — let it throw at boot if the env var isn't set, don't fail
open into an insecure default.

## Medium

- `/api/chat` is unauthenticated with no rate limiting. It has a good 6s
  `AbortController` timeout and graceful fallback chain (confirmed by reading the code —
  this part is genuinely well done), but nothing stops someone from scripting requests
  against it and running up the Gemini API bill. Worth at least a basic per-IP rate limit
  before launch.
- `npm audit` shows 9 high-severity vulnerabilities that aren't fixable via a simple
  `npm audit fix` (they're nested inside Next.js's own dependency tree). Track this — it
  needs a Next.js patch release, not a project-level fix, but it should be monitored, not
  just marked "resolved."

## What's solid

- TypeScript is clean, no errors.
- The `/api/chat` fallback chain (knowledge base → Gemini → smart keyword fallback →
  generic contact info) is a genuinely good resilience pattern — the chatbot degrades
  gracefully instead of breaking.
- Trademark disclaimers and the "Exam Prep Masterclass" rebrand for privacy courses show
  real legal awareness.
- Session/JWT wiring itself (once real auth is behind it) is structurally correct NextAuth
  v4 usage.

## Bottom line

Don't launch with the current auth and knowledge-base write path. #1 and #2 are both
live, exploitable today on `localhost` and would be exploitable on any public deployment
as-is. Everything else here is fixable in normal follow-up work.
