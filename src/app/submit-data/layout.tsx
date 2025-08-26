import type { Metadata } from "next";
import SubmitDataStructuredData from "@/components/submit-data-structured-data";

export const metadata: Metadata = {
  title: "Submit Your University Admissions Data",
  description:
    "Share your university application and academic data anonymously to help other students understand admission requirements and make informed decisions.",
  keywords: [
    "submit ontario admissions data",
    "ontario university applications",
    "canadian academic grades",
    "ontario admission statistics",
    "canadian university data sharing",
    "ontario university requirements",
    "canadian college applications",
    "ontario high school grades",
    "canadian admission data",
  ],
  openGraph: {
    title: "Submit Your University Admissions Data | admitme",
    description:
      "Share your university application data anonymously to help other students.",
    url: "/submit-data",
  },
  twitter: {
    title: "Submit Your University Admissions Data | admitme",
    description:
      "Share your university application data anonymously to help other students.",
  },
};

export default function SubmitDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubmitDataStructuredData />
      {children}
    </>
  );
}
