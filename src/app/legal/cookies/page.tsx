export default function CookiesPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cookie Policy
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
              What Are Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They help websites
              remember information about your visit, such as your preferred
              language and other settings, which can make your next visit easier
              and more useful.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Admit.me uses cookies to enhance your browsing experience and
              provide our services effectively. We use cookies for the following
              purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Authentication and security</li>
              <li>Storing your preferences and settings</li>
              <li>
                Analyzing how our website is used to improve functionality
              </li>
              <li>Ensuring our website works properly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are necessary for the website to function
                  properly. They enable core functionality such as security,
                  network management, and accessibility.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Authentication tokens to keep you logged in</li>
                  <li>Session management for secure access</li>
                  <li>Security tokens to prevent cross-site request forgery</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Functional Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies allow the website to remember choices you make
                  and provide enhanced, more personal features.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Theme preferences (light/dark mode)</li>
                  <li>Language settings</li>
                  <li>Form data persistence</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with
                  our website by collecting and reporting information
                  anonymously.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Page view tracking</li>
                  <li>User journey analysis</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some cookies on our site are set by third-party services that
              appear on our pages:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Supabase:</strong> Used for authentication and user
                session management
              </li>
              <li>
                <strong>Vercel:</strong> Used for website hosting and
                performance optimization
              </li>
              <li>
                <strong>Tempo:</strong> Used for development and debugging
                purposes (if enabled)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookie Duration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Session Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are temporary and are deleted when you close
                  your browser. They are primarily used for authentication and
                  security purposes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Persistent Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies remain on your device for a set period or until
                  you delete them. They help us remember your preferences and
                  improve your experience on return visits.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Managing Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies.
              You can set or amend your web browser controls to accept or refuse
              cookies:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Browser Settings
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>
                    See what cookies you have and delete them individually
                  </li>
                  <li>Block third-party cookies</li>
                  <li>Block cookies from particular sites</li>
                  <li>Accept cookies only from sites you're currently on</li>
                  <li>Block all cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Impact of Disabling Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Please note that if you disable cookies, some features of our
                  website may not work properly. Essential cookies are required
                  for basic functionality such as logging in and accessing your
                  account.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are committed to protecting your privacy. Any data collected
              through cookies is handled in accordance with our Privacy Policy.
              We do not sell or share cookie data with third parties for
              marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. When we make changes, we will update the "Last
              updated" date at the top of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us through our{" "}
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
