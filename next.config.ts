import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

// This app is entirely self-contained: no iframes, no third-party scripts
// or CDN assets, no client-side fetches to anything but same-origin /api/*
// routes (the Laravel backend is only ever called server-side, see
// portalAuth.ts). next/font self-hosts Google Fonts at build time, so
// there's no runtime request to fonts.googleapis.com. Mermaid diagrams
// render client-side with securityLevel: 'strict' and do no network I/O.
// NextAuth's Google/LinkedIn sign-in is a same-origin form POST that
// responds with a redirect - full top-level navigation isn't governed by
// these directives, so no external origins need allowing here.
//
// 'unsafe-inline' on script-src is required by Next.js App Router's RSC
// streaming, which injects inline `self.__next_f.push(...)` hydration
// scripts - avoiding it would need per-request nonce middleware, which this
// app doesn't have. 'unsafe-eval' is added in dev only, for Fast Refresh.
// va.vercel-scripts.com is also dev-only: @vercel/analytics only reaches
// out to it when running outside Vercel (local dev) - once deployed it
// loads from the same-origin /_vercel/insights/script.js path instead.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'", 'https://va.vercel-scripts.com'] : []),
].join(' ');

const CSP = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
