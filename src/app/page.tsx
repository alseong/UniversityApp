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

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Your Data
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Admit.me and how it works.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <details className="group border border-gray-200 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">
                  What is Admit.me?
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div className="group-open:rotate-45 transition-transform duration-200">
                    <Plus className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  Admit.me is a platform that helps students make informed
                  decisions about university admissions by providing transparent
                  access to real admission data from students like you. We're
                  building the most comprehensive database of university
                  admission outcomes to help future applicants understand their
                  chances and prepare better applications.
                </p>
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group border border-gray-200 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">
                  How is my data used?
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div className="group-open:rotate-45 transition-transform duration-200">
                    <Plus className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  Your data is aggregated anonymously to create insights and
                  trends that help other students. We never share personal
                  information or link specific outcomes to individual students.
                  All data is used to build statistical models that show
                  admission patterns and help students understand what
                  successful applications look like.
                </p>
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group border border-gray-200 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">
                  When will the dashboard be ready?
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div className="group-open:rotate-45 transition-transform duration-200">
                    <Plus className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  We're currently collecting data from students to build
                  meaningful insights. Once we have enough data to provide
                  accurate and helpful analytics, we'll launch the dashboard
                  with admission trends, grade comparisons, and personalized
                  recommendations. We'll notify all contributors as soon as it's
                  ready!
                </p>
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="group border border-gray-200 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">
                  Who can submit data?
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div className="group-open:rotate-45 transition-transform duration-200">
                    <Plus className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  Any current or former high school student who has applied to
                  or is interested in applying to universities can contribute
                  their data. Whether you're currently in Grade 11/12, recently
                  graduated, or already in university, your admission experience
                  helps build a comprehensive picture for future students.
                </p>
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="group border border-gray-200 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">
                  Is my personal information secure?
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div className="group-open:rotate-45 transition-transform duration-200">
                    <Plus className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  Yes, we take privacy seriously. All data is stored securely
                  and only you can access your personal submission. When we use
                  data for insights, it's completely anonymized and aggregated
                  so individual students cannot be identified. We never sell or
                  share personal information with third parties.
                </p>
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className="group border border-gray-200 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">
                  Can I update my information later?
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div className="group-open:rotate-45 transition-transform duration-200">
                    <Plus className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  Absolutely! You can update your admission data anytime. As
                  your application status changes (from "interested" to
                  "applied" to "accepted"), you can log back in and update your
                  information. This keeps our data current and helpful for other
                  students.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
