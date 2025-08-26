"use client";

import { useEffect } from "react";

export default function FeedbackPage() {
  useEffect(() => {
    // Redirect immediately to the external feedback form
    window.location.href = "https://app.youform.com/forms/i14kuart";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to feedback form...</p>
        <p className="text-sm text-gray-500 mt-2">
          If you're not redirected automatically,{" "}
          <a
            href="https://app.youform.com/forms/i14kuart"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
