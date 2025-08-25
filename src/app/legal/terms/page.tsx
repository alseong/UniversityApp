export default function TermsPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
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
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Admit.me, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree
              to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Use License
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily access Admit.me for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                attempt to reverse engineer any software contained on Admit.me
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Content
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By submitting academic data to Admit.me, you grant us a
              non-exclusive, worldwide, royalty-free license to use, aggregate,
              and anonymize your data for statistical and research purposes. You
              represent that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>You have the right to submit the information you provide</li>
              <li>
                Your submissions are accurate to the best of your knowledge
              </li>
              <li>
                You will not submit false, misleading, or fraudulent information
              </li>
              <li>
                You will not violate any laws or regulations through your use of
                our service
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Prohibited Uses
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>
                For any unlawful purpose or to solicit others to perform
                unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations or laws
              </li>
              <li>
                To transmit, or procure the sending of, any advertising or
                promotional material
              </li>
              <li>To impersonate or attempt to impersonate another person</li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disclaimer
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The information on this website is provided on an 'as is' basis.
              To the fullest extent permitted by law, Admit.me excludes all
              representations, warranties, conditions and terms related to our
              website and the use of this website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Admit.me provides aggregated data for informational purposes only.
              We do not guarantee the accuracy of any predictions or insights
              derived from our data. University admissions decisions depend on
              many factors beyond academic performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitations
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In no event shall Admit.me or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Admit.me's website, even if
              Admit.me or an authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Account Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to terminate or suspend your account and
              access to our service immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation
              if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days
              notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us through our{" "}
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
