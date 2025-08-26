import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View your admissions data submissions and track university application statistics on your personal dashboard.",
  keywords: [
    "admissions dashboard",
    "university applications",
    "personal data",
    "application tracking",
    "admissions statistics",
  ],
  openGraph: {
    title: "Dashboard | admitme",
    description:
      "View your admissions data and university application statistics.",
    url: "/dashboard",
  },
  robots: {
    index: false, // Don't index personal dashboard pages
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
