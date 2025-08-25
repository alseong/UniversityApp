import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  BarChart3,
  Database,
  GraduationCap,
  TrendingUp,
  Plus,
} from "lucide-react";
import { createClient } from "../../supabase/server";

// Client component for auth-aware CTA button
function CTAButton({ user }: { user: any }) {
  return (
    <div className="flex justify-center">
      <a
        href={user ? "/submit-data" : "/sign-in"}
        className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
      >
        Get Early Access
        <ArrowUpRight className="ml-2 w-5 h-5" />
      </a>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero user={user} />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Admit.me</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get real insights into university admissions with data-driven
              transparency that helps students make informed decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Database className="w-6 h-6" />,
                title: "Real Student Data",
                description: "Actual admission outcomes from real students",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Detailed Analytics",
                description: "Comprehensive admission trends and statistics",
              },
              {
                icon: <GraduationCap className="w-6 h-6" />,
                title: "All Universities",
                description: "Data from universities across the country",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Grade Requirements",
                description: "See what grades actually get accepted",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            To help every student access higher education through the most
            transparent and honest admission data.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Help Build the Future of Admissions Transparency
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Share your admission data anonymously and help future students make
            informed decisions. Every data point matters.
          </p>
          <CTAButton user={user} />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Got questions? We've got answers about how our platform works and
              how we protect your data.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  question: "Is my data really anonymous?",
                  answer:
                    "Yes, absolutely. We never store personally identifiable information. All data is aggregated and anonymized before being used for statistics. Your individual submission cannot be traced back to you.",
                },
                {
                  question: "What data do you collect?",
                  answer:
                    "We collect academic information like grades, courses, university applications, and admission outcomes. We do not collect names, addresses, student IDs, or any personal identifiers.",
                },
                {
                  question: "Who can see my submission?",
                  answer:
                    "No one can see your individual submission. Your data is aggregated anonymously to create insights and statistics that help future students make informed decisions.",
                },
                {
                  question: "Can I update my data after submitting?",
                  answer:
                    "Yes! You can log in anytime to update your admission data as you receive new outcomes or want to add more information.",
                },
                {
                  question: "How do you ensure data accuracy?",
                  answer:
                    "We use validation rules and verification processes to ensure data quality. While we can't verify every submission, we use statistical methods to identify and filter out outliers or potentially false data.",
                },
                {
                  question: "Is this service free?",
                  answer:
                    "Yes, Admit.me is completely free for students. Our mission is to democratize access to admission information and help level the playing field for all students.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Who Can Submit Data?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We welcome submissions from various students to build a
              comprehensive database.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Current High School Students",
                description:
                  "Students currently in Grade 11 or 12 who are applying to universities",
                emoji: "🎓",
              },
              {
                title: "Recent Graduates",
                description:
                  "Students who graduated within the last 2 years and have admission outcomes",
                emoji: "📚",
              },
              {
                title: "Current University Students",
                description:
                  "First and second-year university students who remember their admission data",
                emoji: "🏫",
              },
            ].map((group, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <div className="text-4xl mb-4">{group.emoji}</div>
                <h3 className="font-semibold mb-2">{group.title}</h3>
                <p className="text-gray-600 text-sm">{group.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Any current or former high school student who has applied to
              university can contribute valuable data to help future applicants.
              Your data is aggregated anonymously to create insights and
              statistics for everyone's benefit.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
