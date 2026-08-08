# CyberGOAT Services LLC — working notes

This directory (`scratch/`) is the Next.js frontend for CyberGOAT's website and student portal. The Laravel backend lives in the `cybergoat-laravel-lms/` subdirectory as a separate git repo.

**Before doing any non-trivial exploration, read `HANDOFF_TO_ANTIGRAVITY_<latest-date>.md`** (the most recently dated one sitting directly in this directory's root — as of 2026-08-08 that's `HANDOFF_TO_ANTIGRAVITY_2026-08-08.md`) — it's a maintained architecture/deploy/gotcha reference covering both repos. Reading it first avoids re-deriving things like the deploy commands, known Windows/gcloud quoting issues, which parts of the site are real vs. hardcoded, and the current feature/testing status.

**After any significant change** — a new feature, a schema change, a new deploy pattern, a newly-discovered gotcha, or a meaningful shift in what's pending — **update that handoff doc** (or write a new dated one if the existing one has drifted far from current state). When you write a new dated handoff, move the previous root-level one into `docs/handoffs/` rather than leaving multiple dated versions loose at the repo root — history is kept, just out of the way, in `docs/handoffs/`. Only one `HANDOFF_TO_ANTIGRAVITY_*.md` should ever sit at root at a time. This file is shared context for both Claude and other tools (e.g. Gemini/Antigravity) working in this same directory — keeping it current is what makes that collaboration actually work instead of each session re-discovering the same things.

**Repo root should stay minimal**: `README.md`, `CLAUDE.md`, and the single current `HANDOFF_TO_ANTIGRAVITY_*.md`. Everything else historical or reference-only (old handoffs, audit reports, the project brief) lives in `docs/`. Don't let one-off source-code dumps, stray exported HTML, or abandoned experiment directories accumulate at root or get committed — a repo a new developer clones should look like the live app, not an archive of everything ever tried.

Other repo-specific conventions:
- Two repos, two separate git histories — commits to `cybergoat-laravel-lms/` don't show up in `scratch/`'s history and vice versa.
- No CI/CD pipeline — deploys are direct `gcloud run deploy --source .` / `vercel --prod --yes --archive=tgz` from local source, not triggered by git push.
- More than one person/tool can write directly to production data (Filament admin panel, other AI sessions) — check current state before assuming a seeder or migration is starting from a clean slate, especially for the course catalog.
- Both repos periodically drift ahead of their GitHub remotes since deploys don't go through git push — run `git status -sb` / `git fetch && git log origin/main..HEAD` before assuming GitHub reflects the current state, and push deliberately rather than letting local and GitHub diverge for long.
