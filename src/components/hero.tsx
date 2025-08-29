"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Single Source of Truth
              </span>{" "}
              for University Admissions
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Real admission statistics from students across Canada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!loading && (
                <>
                  <Link
                    href={user ? "/submit-data" : "/sign-in"}
                    className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    Get Early Access
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Link>

                  <Link
                    href={user ? "/dashboard" : "/sign-in"}
                    className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                  >
                    View Statistics
                  </Link>
                </>
              )}

              {loading && (
                <div className="flex gap-4">
                  <div className="px-8 py-4 bg-gray-200 rounded-lg animate-pulse">
                    <div className="w-32 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="px-8 py-4 bg-gray-100 rounded-lg animate-pulse">
                    <div className="w-28 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16 flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Real Student Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Always Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
