"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    closeMenu();
  };

  if (loading) {
    return (
      <nav className="w-full border-b border-gray-200 bg-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" prefetch className="text-xl font-bold text-blue-600">
            Admit.me
          </Link>
          <div className="flex gap-4 items-center">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold text-blue-600 flex items-center gap-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="6" fill="#2563eb" />
            <path d="M16 6L28 12L16 18L4 12L16 6Z" fill="#ffffff" />
            <path
              d="M10 12V18C10 20.2091 12.7909 22 16 22C19.2091 22 22 20.2091 22 18V12"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M22 14V20L24 22"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          admitme
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/blog"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Blog
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/2026-results"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                <span className="text-yellow-500">🎉</span>
                2026 Live Insights
              </Link>
              <Link
                href="/submit-data"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Your Admissions Data
              </Link>
              <Link
                href="/feedback"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Feedback
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/blog"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Blog
              </Link>
              <Link
                href="/2026-results"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                <span className="text-yellow-500">🎉</span>
                2026 Live Insights
              </Link>
              <Link
                href="/feedback"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Feedback
              </Link>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  href="/2026-results"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <span className="text-yellow-500">🎉</span>
                  2026 Live Insights
                </Link>
                <Link
                  href="/submit-data"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Your Admissions Data
                </Link>
                <Link
                  href="/feedback"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Feedback
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/feedback"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Feedback
                </Link>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="block w-full px-4 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
