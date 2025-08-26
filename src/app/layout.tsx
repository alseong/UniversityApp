import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import StructuredData from "@/components/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "admitme | University Admissions Data & Statistics",
    template: "%s | admitme",
  },
  description:
    "The single source of truth for university admissions data. Real admission statistics from students to provide transparency in university and college admission requirements.",
  keywords: [
    "ontario university admission grades",
    "canadian university admissions",
    "ontario college admission requirements",
    "canadian admission statistics",
    "ontario university requirements",
    "canadian university applications",
    "ontario admission averages",
    "canadian college admissions data",
    "ontario university data",
    "canadian admission transparency",
    "ontario grade requirements",
    "canadian university entrance",
    "ontario post-secondary admissions",
    "canadian education statistics",
    "ontario high school grades university",
    "canadian university grade requirements",
    "university admissions",
    "college admissions data",
    "admission statistics",
    "university requirements",
    "admissions transparency",
    "student data",
    "university applications",
    "admission rates",
    "academic requirements",
  ],
  authors: [{ name: "admitme" }],
  creator: "admitme",
  publisher: "admitme",
  metadataBase: new URL("https://www.admit-me.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.admit-me.com",
    title: "admitme | University Admissions Data & Statistics",
    description:
      "The single source of truth for university admissions data. Real admission statistics from students to provide transparency in university admission requirements.",
    siteName: "admitme",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "admitme - University Admissions Data Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "admitme | University Admissions Data & Statistics",
    description:
      "The single source of truth for university admissions data. Real admission statistics from students.",
    images: ["/og-image.png"],
    creator: "@admitme",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <StructuredData />
        <TempoInit />
        <Analytics />
      </body>
    </html>
  );
}
