# Handoff to Antigravity — 2026-08-05

**This supersedes `HANDOFF_TO_ANTIGRAVITY_2026-08-03.md`.** That document is now stale — a full independent audit and two rounds of real bug fixes happened since. Don't reference it for current state. As always: if anything here seems off, re-verify against actual code/config/live infrastructure rather than trusting prose. That habit has caught real, live bugs every single time it's been applied this engagement — including three of the ones fixed below.

A companion document, `TECHNICAL_HANDOFF_2026-08-05.md`, covers implementation-level detail (exact patterns, file map, commands, and specific behavioral notes about working alongside Antigravity on this codebase). Read this one first for status; read that one before making changes.

## One-line status

Everything from the 08-03 handoff is still true and still live. Since then: a real typing bug affecting every modal was fixed, a logout desync bug was fixed, enrollment-inquiry email notifications were built and verified working, a KHDA-compliance wording pass was started, and a full independent audit of both repos (frontend + backend) found and fixed 8 more real bugs — including one that was silently dropping every corporate/B2B lead. All of it is committed, pushed to GitHub, and deployed to production on both platforms as of this handoff. Frontend HEAD: `90c27de`. Backend HEAD: `ed1efb1`.

---

## 1. What changed since the 08-03 handoff

**Bug fixes, both verified live in production, not just committed:**
- Every modal on the site (Contact, Sign In, Skill Assessment, Chatbot Training, Track Detail) only accepted one character per keystroke in its text fields — a stale `useEffect` dependency caused a focus-steal on every re-render. Fixed in `src/app/components/Modal.tsx`.
- Signing out from one entry point (the homepage popup) didn't actually clear the other session (the dashboard's). NextAuth's session cookie and the Sanctum `portal_token` cookie are two independent systems; only one was ever being cleared depending on which "Sign Out" button was clicked. A signed-out user signing back in immediately would silently reuse the leftover session with no real re-auth. Fixed via a shared `src/app/lib/logout.ts`.

**New feature:** Enrollment & Schedule Inquiry submissions (`TrackDetailModal.tsx` → `/api/leads`) were being saved to Redis with zero notification — the only way to see one was to manually check `/admin/leads`. Now sends a real email to `admin@cybergoat.ae` via Gmail SMTP on every submission. Verified with an actual received email, not just a 200 response.

**KHDA compliance wording — started, not finished.** The homepage hero badge was changed from "Dubai Campus & Online / In-person sessions..." to "Dubai HQ & Virtual Bootcamps" (`src/app/components/sections.tsx`) — a genuine regulatory concern, not cosmetic: KHDA approval applies to paid training regardless of delivery mode, but in-person/classroom delivery specifically requires an inspected physical premises with a Civil Defence certificate, while online-only delivery only needs a registered business address. Claiming in-person/campus delivery without holding that specific permit tier is a real exposure. **This fix only touched one of at least 7 places** making the same kind of claim — see Open Items.

**Full independent audit, both repos, 8 real bugs found and fixed** (see the technical handoff for the file-by-file list). The standout: the B2B/Corporate lead form (`CorporateB2BSection.tsx`) never sent the field `/api/leads` required, so every single corporate inquiry got a silent 400 while the visitor saw "Proposal Request Received." Likely the highest-value leads on the site, being dropped with zero signal, probably since the form was built.

## 2. Architecture — unchanged from 08-03

Everything in section 1 of the previous handoff (two repos, two deploy platforms, domain setup, decommissioned old backend) is still accurate. Nothing architectural changed this round — only application-level fixes.

## 3. Real integrations — unchanged, still verified

GCS, Vertex AI, Google Sheets, Google Calendar, Stripe: all still live and working as described in the 08-03 handoff. Not re-verified this round because nothing touched them, but also nothing regressed them.

## 4. Open items — genuinely still pending

1. **Real course pricing, bundle, coupon data.** Still the one blocker before real customers can buy anything. Still needs real numbers from the client — do not invent placeholders.
2. **Site-wide KHDA wording consistency.** The homepage hero badge says "Virtual Bootcamps," but `refund-policy/page.tsx`, `CorporateB2BSection.tsx`, the enrollment form's "In-Person Dubai Bootcamp" option, and the AI chatbot's own system prompt (`api/chat/route.ts`) all still actively describe/offer in-person delivery. The client's position (as of this handoff) is that temporary per-course-run licenses can cover legitimate in-person sessions, so this may be intentional — **confirm with the client before touching any of these**, don't assume the homepage fix should propagate everywhere.
3. **GitHub Dependabot alerts.** Frontend repo currently shows 11 vulnerabilities (4 high, 6 moderate, 1 low) per GitHub's own scan as of the last push. Not investigated this round — worth a look.

## 5. Handling secrets / credentials

Same rule as always: never write actual secret values into any committed file or handoff doc. This round added two new ones, both stored as Vercel **Sensitive** environment variables (write-only after creation — even the CLI owner can't read them back out, by design): `GMAIL_APP_PASSWORD` and `GMAIL_SENDER_EMAIL` (the latter isn't actually sensitive in nature, Vercel just auto-flagged it since it was added in the same batch — harmless). If either needs rotating, generate fresh and overwrite; don't go looking for the old value anywhere.

The GitHub PAT mentioned in the 08-03 handoff is still active and was used again this round for pushes to both repos. Same guidance applies: ask the client if you need it and don't have it.

## 6. Working alongside Antigravity — see the technical handoff

The division-of-labor guidance from the 08-03 handoff still stands. The technical handoff adds specific, concrete observations from this round (the KHDA commit only fixing 1 of 8 files, a previously-proposed insecure auth design, concurrent production deploys happening from both sides at once) — read it before starting multi-file work.
