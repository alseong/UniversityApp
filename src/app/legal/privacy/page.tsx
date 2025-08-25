export default function PrivacyPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At admitme, we are committed to protecting your privacy and
              ensuring transparency in how we handle your data. This Privacy
              Policy explains what information we collect, how we use it, and
              your rights regarding your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Academic Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect academic data you voluntarily provide, including
                  grades, course information, university applications, and
                  admission outcomes. This data is anonymized and aggregated for
                  statistical purposes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Account Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  When you create an account, we collect your email address for
                  authentication purposes. We do not store passwords directly;
                  we use secure authentication through Supabase.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To provide and improve our services</li>
              <li>
                To create anonymous, aggregated statistics for research purposes
              </li>
              <li>To authenticate your account and provide secure access</li>
              <li>To communicate important updates about our service</li>
              <li>To respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Anonymization
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your individual submissions are never shared or made public. All
              academic data is anonymized and aggregated before being used for
              insights and statistics. We use advanced techniques to ensure
              individual users cannot be identified from our published data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your
              data, including encryption in transit and at rest. Our
              infrastructure is hosted on secure cloud platforms with regular
              security audits and monitoring.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Withdraw consent for data processing</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Third-Party Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use Supabase for authentication and data storage, and Vercel
              for hosting. These services have their own privacy policies and
              security measures. We do not share your personal information with
              any other third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us through our{" "}
              <a
                href="https://app.youform.com/forms/i14kuart"
                className="text-blue-600 hover:text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                feedback form
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
