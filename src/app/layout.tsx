import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ModalsProvider } from "./components/site-modals";
import AuthProvider from "./components/AuthProvider";
import GoogleStructuredData from "./components/GoogleStructuredData";
import { SOCIAL_LINKS } from "@/config/socials";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cybergoat.ae"),
  title: {
    default: "CyberGOAT | Premier AI & Cybersecurity Consulting & Certification Kits Dubai",
    template: "%s | CyberGOAT Services LLC",
  },
  description:
    "Dubai Silicon Oasis premier AI & Cybersecurity Consulting practice and EC-Council Authorized Reseller. Official certification kits and exam vouchers for CEH v13 AI, CHFI v11, C|CISO, plus GRC & AI governance advisory.",
  keywords: [
    "Cybersecurity Consulting Dubai",
    "AI Governance Advisory Dubai",
    "GRC Advisory Dubai",
    "EC-Council Partner Dubai",
    "CEH v13 AI Certification Kit UAE",
    "CHFI v11 Certification Kit",
    "C|CISO Certification Kit Dubai",
  ],
  authors: [{ name: "CyberGOAT Services LLC", url: "https://www.cybergoat.ae" }],
  openGraph: {
    title: "CyberGOAT | Premier EC-Council Partner & Certification Kits Dubai",
    description:
      "Official EC-Council Authorized Partner in Dubai Silicon Oasis. Certification kits for Cyber Defense, Digital Forensics & Executive CISO Leadership.",
    url: "https://www.cybergoat.ae",
    siteName: "CyberGOAT",
    images: [
      {
        url: "/cg-assets/grc_cyber_shield.png",
        width: 1200,
        height: 630,
        alt: "CyberGOAT EC-Council Certification Kits Dubai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberGOAT | EC-Council Certification Kits & GRC Advisory Dubai",
    description: "Official EC-Council Partner. Certification kits with official iLabs access, plus GRC & AI governance advisory.",
    site: SOCIAL_LINKS.twitterHandle,
    creator: SOCIAL_LINKS.twitterHandle,
    images: ["/cg-assets/grc_cyber_shield.png"],
  },
  alternates: {
    canonical: "https://www.cybergoat.ae",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleStructuredData />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ModalsProvider>
            {children}
            <Analytics />
          </ModalsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
