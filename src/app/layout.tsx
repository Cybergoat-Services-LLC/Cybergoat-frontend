import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ModalsProvider } from "./components/site-modals";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberGOAT | Security & Privacy Training",
  description: "Ready to level-up your cybersecurity and privacy expertise? CyberGOAT offers personalized training programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
