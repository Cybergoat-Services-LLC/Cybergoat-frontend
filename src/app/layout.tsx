import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ModalsProvider } from "./components/site-modals";
import AuthProvider from "./components/AuthProvider";
import GoogleStructuredData from "./components/GoogleStructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cybergoat.ae"),
  title: {
    default: "CyberGOAT | Premier EC-Council Partner & Cybersecurity Academy Dubai",
    template: "%s | CyberGOAT Services LLC",
  },
  description:
    "Dubai Silicon Oasis premier EC-Council Authorized Reseller & Training Partner. Official training and exam vouchers for CEH v12, CHFI v11, C|CISO, CISA, CISM, CISSP, and Data Privacy laws.",
  keywords: [
    "Cybersecurity Training Dubai",
    "EC-Council Partner Dubai",
    "CEH v12 Training UAE",
    "CHFI v11 Certification",
    "CISO Training Dubai Silicon Oasis",
    "CISA Exam Preparation",
    "CISSP Bootcamp Dubai",
    "UAE PDPL GDPR Privacy Training",
  ],
  authors: [{ name: "CyberGOAT Services LLC", url: "https://www.cybergoat.ae" }],
  openGraph: {
    title: "CyberGOAT | Premier EC-Council Partner & Cybersecurity Academy Dubai",
    description:
      "Official EC-Council Authorized Partner in Dubai Silicon Oasis. Master Cyber Defense, Digital Forensics & Executive CISO Leadership.",
    url: "https://www.cybergoat.ae",
    siteName: "CyberGOAT",
    images: [
      {
        url: "/cg-assets/grc_cyber_shield.png",
        width: 1200,
        height: 630,
        alt: "CyberGOAT Cybersecurity Academy Dubai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberGOAT | Cybersecurity & Privacy Training Dubai",
    description: "Official EC-Council Partner. Hands-on Cyber Range Labs & Executive CISO Training.",
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
