import Link from "next/link";
import { Linkedin } from "lucide-react";
// import { Twitter, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-12">
          {/* Platform Column - Commented Out */}
          {/* <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#statistics"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Statistics
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Submit Data
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Universities
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Data Column - Commented Out */}
          {/* <div>
            <h3 className="font-semibold text-gray-900 mb-4">Data</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Accuracy
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://app.youform.com/forms/i14kuart"
                  className="text-gray-600 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-600 hover:text-blue-600">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://app.youform.com/forms/i14kuart"
                  className="text-gray-600 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/security"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} Admit.me. All rights reserved.
          </div>

          <div className="flex space-x-6">
            {/* <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a> */}
            <a
              href="https://www.linkedin.com/in/minjun1998/"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            {/* <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
