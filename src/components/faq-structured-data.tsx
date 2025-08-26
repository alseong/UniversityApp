import Script from "next/script";

export default function FAQStructuredData() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: "University Admissions FAQ",
    description: "Frequently asked questions about university admissions data",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is my data really anonymous?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, absolutely. We never store personally identifiable information. All data is aggregated and anonymized before being used for statistics. Your individual submission cannot be traced back to you. The data is anonymous to others.",
        },
      },
      {
        "@type": "Question",
        name: "What university admission data can I submit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can submit your high school grades (including course levels and types), university application results, admission averages, and other academic achievements. This helps other students understand university admission requirements.",
        },
      },
      {
        "@type": "Question",
        name: "How does this help other students?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By sharing your university admission data anonymously, you help create transparency in university admissions. Other students can see real admission statistics, grade requirements, and application outcomes to make informed decisions about their university applications.",
        },
      },
      {
        "@type": "Question",
        name: "What universities and colleges are included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our platform includes admission data for universities and colleges that students apply to. This provides comprehensive statistics for students considering post-secondary education options.",
        },
      },
      {
        "@type": "Question",
        name: "Can I see admission averages for universities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our platform provides real admission data including grade averages, application outcomes, and requirements for universities. This data comes directly from students who have gone through the admission process.",
        },
      },
    ],
  };

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
}
