import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalsProvider } from "./components/site-modals";

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
        <ModalsProvider>{children}</ModalsProvider>
      </body>
    </html>
  );
}
