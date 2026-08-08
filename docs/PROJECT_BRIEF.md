# CyberGOAT — Project Brief (compiled 2026-07-27)

Compiled from: live site (cybergoat.ae), the Next.js scratch project, the old Angular
frontend export, the Laravel LMS backend reference, the official SRS/content PDFs in
Google Drive, and the WhatsApp history with the freelance developer.

## 1. What CyberGOAT is

A licensed cybersecurity & privacy training provider (Dubai, UAE — CyberGoat Services
LLC). Offers certification prep (EC-Council, ISACA, ISC2, IAPP, TOGAF), custom corporate
training, GRC/compliance interpretation (UAE Data Privacy Law, DESC ISR, GDPR, NIS2, DORA,
GenAI/AI compliance), webinars, and bootcamps (CISM, CEH, etc.).

## 2. The official spec (from the SRS PDF)

Three user tiers:
- **Basic users** — browse About/Services/Resources/Contact, no login. AI chatbot access.
- **Registered users** — login via **Google or LinkedIn** (no email/password signup),
  enroll in free/paid courses, live sessions, progress dashboard, download materials,
  **AI-enabled mock exams and mock interviews**.
- **Admin users** — manage content, courses, schedules, users, activity reports.

Explicit requirements:
- Responsive for desktop/laptop/tablet — **mobile view explicitly out of scope**.
- **Stripe payment gateway** — stated as "already functional, requires integration."
- Live sessions via Google Workspace / Zoom.
- Chatbot via external API (Gemini was chosen later, per WhatsApp history).
- Learning calendar synced to Google Calendar.

## 3. Required homepage structure (from the business side, verbatim spec in WhatsApp)

1. **Top bar**: logo (left), search bar (center), "Chat with us" next to search, tabs
   (right): LMS login, Contact Us, Privacy Policy, Sign Up/Sign In.
2. **Middle**: three banners — Certifications (EC-Council), On-demand learnings,
   Customized curriculums (with "contact us to know more"). Below: "Access our library
   and courses" — sign up via Gmail/LinkedIn.
3. **About Us** section (exact copy already in the brief — matches what's live).
4. **Bottom**: testimonials/success stories, footer with social links.

Note: **no search bar, no "Chat with us" widget** currently exist in either the live
site or the Next.js scratch page — that's a real gap against spec.

## 4. Real backend already exists and is fairly complete

`backend-reference/` is a Laravel app (looks like a commercial LMS codebase) with routes
for: `login`, `signup`, `all_categories`, `categories`, `category_details`,
`sub_categories`, `category_wise_course`, `filter_course`, `my_wishlist`, `cart_list`,
`my_courses`, `course_details_by_id`, `save_course_progress`, Zoom settings/meetings,
`payment/{token}`, `free_course_enroll`. Separate route files for admin/instructor/
student/chat/payment/player. This is much more than a marketing site backend — it's a
real LMS. The Next.js scratch page currently only calls `/api/all_categories` with a
static fallback; everything else is unused.

## 5. Timeline of what actually happened (from WhatsApp, Sep 2024 – Jan 2026)

- A freelance developer ("Adnan") built the original Angular static site, then a
  separate LMS backend in PHP/Laravel — the two didn't sync well on one domain, so a
  decision was made to rebuild the frontend to match, in a different framework/language.
- Recurring pattern: slow delivery, long silences, business side ("Rehana"/"Shahzad")
  repeatedly asking for status and pushing back "we can't afford more time."
- Real infra in place: `cybergoat.ae` (Hostinger), `lms.cybergoat.ae`, domain via
  onlydomains.com, Stripe payments, Gemini-based chatbot (configured with a small FAQ
  set, but business side said it wasn't answering CyberGOAT-specific questions well).
- Last message in the group (2026-01-09) is just a new WhatsApp group invite link —
  suggests the relationship with this developer may be winding down or shifting.
- **Security note**: the WhatsApp export contains plaintext credentials (domain
  registrar login, admin email/password, 2FA codes). Worth rotating those independent
  of this project — they shouldn't sit in a Drive-synced chat export long-term.

## 6. State of the Next.js scratch project (what Gemini/Antigravity built)

Present: Navbar (dead links), Hero, Who We Are, Strategy, Featured Tracks (API + static
fallback), Footer. Dark theme, Tailwind, real brand colors/logos.

Missing vs. spec/live site: search bar, "Chat with us", Vision/Mission sections, Sign-In
modal (Google/LinkedIn OAuth — not email/password per spec), Contact modal, mobile nav,
testimonials, blog, real course catalog (CISA/CISM/CRISC/CISSP/CEH/CIPP-E/CIPM/TOGAF/
COBIT5), any wiring to the real LMS backend beyond one endpoint.

## 7. Recommendation

Two honest paths, and they shouldn't be conflated:

- **A. Marketing site polish** — bring the Next.js page fully up to the real content/
  spec (Vision/Mission, real course list, testimonials, Sign-In and Contact modals,
  mobile nav, visual polish) using static content. Achievable today, no backend risk.
- **B. Full LMS integration** — wire the Next.js frontend to the real Laravel API
  (login via Google/LinkedIn, live course data, cart, payment, dashboard). This is a
  much bigger effort and depends on the Laravel backend actually running somewhere
  reachable (`NEXT_PUBLIC_API_URL` currently defaults to `localhost:8000`).

Given "get something working today," (A) is the realistic scope. (B) is worth doing but
is a multi-day backend+frontend integration effort, not a today task.
