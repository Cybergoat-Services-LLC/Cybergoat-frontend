# CyberGOAT Services LLC — working notes

This directory (`scratch/`) is the Next.js frontend for CyberGOAT's website and student portal. The Laravel backend lives in the `cybergoat-laravel-lms/` subdirectory as a separate git repo.

**Before doing any non-trivial exploration, read `HANDOFF_TO_ANTIGRAVITY_<latest-date>.md`** (the most recently dated one in this directory) — it's a maintained architecture/deploy/gotcha reference covering both repos. Reading it first avoids re-deriving things like the deploy commands, known Windows/gcloud quoting issues, which parts of the site are real vs. hardcoded, and the current feature/testing status.

**After any significant change** — a new feature, a schema change, a new deploy pattern, a newly-discovered gotcha, or a meaningful shift in what's pending — **update that handoff doc** (or write a new dated one if the existing one has drifted far from current state; keep old dated versions for history, don't delete them). This file is shared context for both Claude and other tools (e.g. Gemini/Antigravity) working in this same directory — keeping it current is what makes that collaboration actually work instead of each session re-discovering the same things.

Other repo-specific conventions:
- Two repos, two separate git histories — commits to `cybergoat-laravel-lms/` don't show up in `scratch/`'s history and vice versa.
- No CI/CD pipeline — deploys are direct `gcloud run deploy --source .` / `vercel --prod --yes --archive=tgz` from local source, not triggered by git push.
- More than one person/tool can write directly to production data (Filament admin panel, other AI sessions) — check current state before assuming a seeder or migration is starting from a clean slate, especially for the course catalog.
