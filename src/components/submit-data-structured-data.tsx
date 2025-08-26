import Script from "next/script";

export default function SubmitDataStructuredData() {
  const webFormData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Submit University Admissions Data",
    description:
      "Submit your university application and academic data anonymously to help other students understand admission requirements",
    url: "https://www.admit-me.com/submit-data",
    inLanguage: "en-CA",
    isPartOf: {
      "@type": "WebSite",
      name: "admitme",
      url: "https://www.admit-me.com",
    },
    about: [
      {
        "@type": "Thing",
        name: "Ontario University Admissions",
        description:
          "University admission data and requirements for Ontario and Canadian universities",
      },
      {
        "@type": "Thing",
        name: "Academic Grade Submission",
        description:
          "Submit Ontario high school grades including U, M, C, E, O level courses for university applications",
      },
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      geographicArea: {
        "@type": "Place",
        name: "Ontario, Canada",
      },
    },
    keywords: [
      "submit ontario university grades",
      "canadian university application data",
      "ontario admission data form",
      "university admission statistics canada",
      "ontario high school grades submission",
    ],
  };

  const actionData = {
    "@context": "https://schema.org",
    "@type": "Action",
    name: "Submit University Admission Data",
    description:
      "Submit your Ontario university admission data including grades, application results, and academic achievements",
    agent: {
      "@type": "Person",
      name: "Ontario Student",
    },
    object: {
      "@type": "Dataset",
      name: "University Admission Data",
      description:
        "Anonymous university admission data including Ontario high school grades, university applications, and admission outcomes",
    },
    target: {
      "@type": "WebPage",
      url: "https://www.admit-me.com/submit-data",
    },
    result: {
      "@type": "Thing",
      name: "Admission Data Statistics",
      description:
        "Contributes to transparent Ontario and Canadian university admission statistics",
    },
  };

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Submit University Admission Data",
    description:
      "Step-by-step guide for students to submit their university admission data anonymously",
    image: "https://www.admit-me.com/icon.svg",
    totalTime: "PT10M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "High School Grades",
      },
      {
        "@type": "HowToSupply",
        name: "University Application Results",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Enter Academic Information",
        text: "Submit your high school grades including course types and marks",
      },
      {
        "@type": "HowToStep",
        name: "Add University Applications",
        text: "Enter details about your university applications including programs and outcomes",
      },
      {
        "@type": "HowToStep",
        name: "Include Additional Achievements",
        text: "Add any other academic achievements or extracurricular activities",
      },
      {
        "@type": "HowToStep",
        name: "Submit Anonymously",
        text: "Submit your data anonymously to help other students understand admission requirements",
      },
    ],
  };

  return (
    <>
      <Script
        id="submit-webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webFormData),
        }}
      />
      <Script
        id="submit-action-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(actionData),
        }}
      />
      <Script
        id="submit-howto-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToData),
        }}
      />
    </>
  );
}
