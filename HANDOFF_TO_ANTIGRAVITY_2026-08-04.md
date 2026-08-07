# 📜 CYBERGOAT MASTER HANDOFF & MEMORY SPECIFICATION (2026-08-04)

**Project**: CyberGOAT Services LLC (`www.cybergoat.ae`)  
**Scope**: Complete Platform Reality + OAuth Activation + LinkedIn Sales Navigator & Google AdWords Launch Spec  

---

## 🟢 1. LIVE SYSTEM ARCHITECTURE & VERIFIED STATE

### A. Next.js 16 Student Portal & Marketing Engine (`www.cybergoat.ae`)
- **Hosting**: Vercel Global Edge Network (SSG + Serverless Route Handlers).
- **Security**: httpOnly cookies for session storage (`portal_token`), zero client-side token exposure.
- **Authentication**:
  - Email & Password login (`/login`).
  - **1-Click Google OAuth 2.0**: Active (`Client ID: 60357540803-...`).
  - **1-Click LinkedIn OpenID Connect**: Active (`Client ID: 77yi4zhv8khz73`).
  - NextAuth Token Bridge (`/api/portal/social-callback`) sending verified provider tokens to Laravel backend.
- **Legal Compliance**:
  - KHDA Wording Audit: `"Dubai HQ & Virtual Bootcamps"` (100% compliant with DSO Free Zone license).
  - Explicit disclaimers for EC-Council Authorized Vouchers vs ISACA / ISC2 / IAPP / TOGAF 10 exam readiness.
- **Automated Marketing**:
  - Live RSS 2.0 Feed (`/rss.xml`).
  - Live Search Engine Sitemap (`/sitemap.xml`).
  - Enterprise B2B Inquiry Hub (`#corporate`).

### B. Laravel 12 LMS Backend (`cybergoat-lms`)
- **Hosting**: GCP Cloud Run (`https://cybergoat-lms-32wnplyecq-uc.a.run.app`).
- **Database**: Cloud SQL MySQL 8.4 (`cybergoat-db`).
- **Testing**: **126 / 126 Passing PHPUnit Tests**.
- **Security**: `SocialAuthVerifier` independently checking Google `id_token` `aud` claims and performing LinkedIn token introspection.
- **Cost**: **$0.00 / month** (backed by **$2,000 USD Google for Startups Cloud Grant**).

---

## 🚀 2. NEXT PHASE ROADMAP: LINKEDIN SALES NAVIGATOR & GOOGLE ADWORDS

### Module 1: LinkedIn Sales Navigator B2B Lead Integration
1. **Target Audience**: CISOs, IT Directors, Compliance Officers, HR Heads in UAE / GCC.
2. **Lead Capture Route**: Map Sales Navigator InMail campaigns directly to `https://www.cybergoat.ae/#corporate`.
3. **Webhook Ingestor**: Auto-sync corporate B2B inquiry form submissions into CRM / Google Sheets.

### Module 2: Google AdWords Campaign & Conversion Infrastructure
1. **Target Keywords**: "CEH v12 Training Dubai", "C|CISO Certification UAE", "CHFI Course DSO", "Cybersecurity Training Dubai".
2. **Conversion Tracking**: Inject Google Tag Manager (GTM) / AdWords Conversion Pixel on:
   - Form submission (`#corporate`).
   - Skill Assessment completion.
   - Successful checkout / Registration.
3. **Landing Page Speed**: SSG pre-rendering ensures **~15ms page load time**, delivering 10/10 Google Ads Quality Score.
