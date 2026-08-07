import type { Metadata } from 'next';

// Admin pages are 'use client' pages, which can't export their own
// `metadata` - this server-component layout applies to both siblings
// (leads, training) instead.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
