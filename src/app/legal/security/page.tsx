export default function SecurityPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security</h1>
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
              Our Commitment to Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At admitme, we take the security of your data seriously. We
              implement multiple layers of security measures to protect your
              information and maintain the integrity of our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Encryption
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  In Transit
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  All data transmitted between your browser and our servers is
                  encrypted using industry-standard TLS/SSL protocols. This
                  ensures that your information cannot be intercepted or
                  tampered with during transmission.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  At Rest
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Your data is encrypted when stored in our databases using
                  AES-256 encryption. This means that even if someone gained
                  unauthorized access to our storage systems, your data would
                  remain protected.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Authentication Security
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                We use Supabase for secure authentication and session management
              </li>
              <li>Passwords are hashed using industry-standard algorithms</li>
              <li>We support secure OAuth providers for easy and safe login</li>
              <li>
                Session tokens are encrypted and have automatic expiration
              </li>
              <li>We implement rate limiting to prevent brute force attacks</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Infrastructure Security
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Hosting and Cloud Security
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our application is hosted on Vercel, which provides
                  enterprise-grade security including DDoS protection, automatic
                  SSL certificates, and global edge caching. Our database is
                  hosted on Supabase with built-in security features and
                  compliance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Access Controls
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We implement strict access controls for our systems. Only
                  authorized personnel have access to production systems, and
                  all access is logged and monitored.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Anonymization
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Beyond traditional security measures, we implement data
              anonymization as an additional layer of protection:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Individual submissions are never linked to personal identifiers
                in our analytics
              </li>
              <li>
                We use statistical techniques to ensure data cannot be
                de-anonymized
              </li>
              <li>
                Published statistics are aggregated from multiple users to
                prevent identification
              </li>
              <li>We regularly audit our anonymization processes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Monitoring and Incident Response
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We continuously monitor our systems for security threats and
              maintain an incident response plan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>24/7 automated monitoring for suspicious activities</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>
                Incident response procedures with defined escalation paths
              </li>
              <li>
                Regular backup procedures to ensure data recovery capabilities
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Role in Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we implement comprehensive security measures, you can help
              protect your account:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use a strong, unique password for your account</li>
              <li>Don't share your login credentials with others</li>
              <li>Log out from public or shared computers</li>
              <li>Keep your browser and devices updated</li>
              <li>Report any suspicious activity immediately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Compliance and Standards
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to meet or exceed industry security standards and best
              practices:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>OWASP (Open Web Application Security Project) guidelines</li>
              <li>SOC 2 Type II compliance through our cloud providers</li>
              <li>GDPR compliance for data protection and privacy rights</li>
              <li>Regular security training for our development team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Reporting Security Issues
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you discover a security vulnerability or have security
              concerns, please contact us immediately through our{" "}
              <a
                href="https://app.youform.com/forms/i14kuart"
                className="text-blue-600 hover:text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                feedback form
              </a>
              . We take all security reports seriously and will respond
              promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Updates to Security Practices
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We continuously review and update our security practices to
              address new threats and incorporate the latest security
              technologies. This page will be updated to reflect any significant
              changes to our security measures.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
