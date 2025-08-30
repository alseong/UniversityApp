import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import StructuredData from "@/components/structured-data";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:
      "admitme | Canadian University Admission Data & Statistics from Students",
    template: "%s | admitme - Canadian University Admission Data",
  },
  description:
    "The single source of truth for university admissions data. Real admission statistics from students across Canada to provide transparency in university and college admission requirements.",
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
    // Additional Ontario-specific keywords
    "ontario university admission data",
    "ontario university admission statistics",
    "ontario university admission requirements",
    "ontario university admission transparency",
    "ontario university admission insights",
    "ontario university admission data from students",
    "student submitted ontario university data",
    "real ontario university admission statistics",
    "ontario university admission requirements database",
    "ontario university admission data platform",
    "ontario university admission process",
    "ontario university admission criteria",
    "ontario university admission standards",
    "ontario university admission benchmarks",
    "what grades do i need for ontario universities",
    "ontario university admission requirements by program",
    "ontario university admission statistics 2024",
    "student admission data ontario universities",
    "real admission statistics ontario universities",
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
    locale: "en_CA",
    url: "https://www.admit-me.com",
    title:
      "admitme | Canadian University Admission Data & Statistics from Students",
    description:
      "Real Canadian university admission data submitted by students. Get transparency in admission requirements, grades, and statistics for universities across Canada.",
    siteName: "admitme - Canadian University Admission Data",
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
    title:
      "admitme | Canadian University Admission Data & Statistics from Students",
    description:
      "Real Canadian university admission data submitted by students. Get transparency in admission requirements, grades, and statistics for universities across Canada.",
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
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
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
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <StructuredData />
        <TempoInit />
        <Analytics />
      </body>
    </html>
  );
}
