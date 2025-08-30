import Script from "next/script";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "admitme",
    alternateName: "admitme - Canadian University Admission Data Platform",
    url: "https://www.admit-me.com",
    description:
      "The single source of truth for Canadian university admissions data. Real admission statistics from students across Canada.",
    keywords:
      "canadian university admission data, canada university admission statistics, canadian university admission requirements, student submitted university data canada",
    inLanguage: "en-CA",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    about: {
      "@type": "Thing",
      name: "Canadian University Admissions",
      description:
        "University admission requirements and statistics for universities across Canada",
    },
    mainEntity: {
      "@type": "Dataset",
      name: "Canadian University Admissions Data",
      description:
        "Anonymous university admission data from students across Canada including grades, application results, and university requirements",
      keywords: [
        "canadian university admission data",
        "canada university admission statistics",
        "canadian university admission requirements",
        "student submitted university data canada",
      ],
      spatial: {
        "@type": "Place",
        name: "Canada",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.admit-me.com/submit-data",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "admitme",
    url: "https://www.admit-me.com",
    description:
      "Platform providing transparency in Ontario and Canadian university admissions through real student data",
    areaServed: {
      "@type": "Place",
      name: "Canada",
    },
    serviceType: "Educational Data Service",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };

  const webApplicationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "admitme",
    url: "https://www.admit-me.com",
    description: "Ontario and Canadian university admissions data platform",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Submit university admission data",
      "View admission statistics",
      "Anonymous data sharing",
      "Ontario university requirements",
      "Canadian college admissions",
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      geographicArea: {
        "@type": "Place",
        name: "Canada",
      },
    },
  };

  const dataCatalogData = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "Ontario University Admissions Dataset",
    description:
      "Comprehensive dataset of Ontario and Canadian university admission statistics including grades, application results, and requirements",
    url: "https://www.admit-me.com",
    keywords: [
      "ontario university admission grades",
      "canadian university admissions",
      "ontario college requirements",
      "canadian admission statistics",
      "ontario high school grades",
      "university entrance requirements",
    ],
    spatialCoverage: {
      "@type": "Place",
      name: "Ontario, Canada",
    },
    temporalCoverage: "2020/..",
    dataset: {
      "@type": "Dataset",
      name: "Anonymous University Admission Data",
      description:
        "Student-submitted university admission data including academic grades, application outcomes, and university requirements",
      keywords:
        "ontario university admissions, canadian college data, admission grades",
      spatial: "Ontario, Canada",
      isAccessibleForFree: true,
    },
  };

  const educationalServiceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "University Admissions Data Service",
    description:
      "Free service providing Ontario and Canadian university admission data and statistics to help students make informed decisions",
    provider: {
      "@type": "Organization",
      name: "admitme",
    },
    areaServed: {
      "@type": "Place",
      name: "Canada",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    serviceType: "Educational Information Service",
    isRelatedTo: [
      "University Admissions",
      "College Applications",
      "Academic Requirements",
      "Student Statistics",
    ],
  };

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <Script
        id="webapplication-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationData),
        }}
      />
      <Script
        id="datacatalog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dataCatalogData),
        }}
      />
      <Script
        id="service-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalServiceData),
        }}
      />
    </>
  );
}
