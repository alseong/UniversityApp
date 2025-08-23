import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  BarChart3,
  Database,
  GraduationCap,
  TrendingUp,
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
            <h2 className="text-3xl font-bold mb-4">Why AdmissionData</h2>
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

      {/* Stats Section */}
      <section id="statistics" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join thousands of students who are making data-driven decisions
              about their university applications.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Admission Records</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Universities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Data Accuracy</div>
            </div>
          </div>
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

      <Footer />
    </div>
  );
}
