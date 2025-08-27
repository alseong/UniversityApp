import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");

  console.log("🔥 OAuth Callback Debug:", {
    fullUrl: requestUrl.toString(),
    origin: requestUrl.origin,
    pathname: requestUrl.pathname,
    code: code ? "present" : "missing",
    redirect_to: redirect_to,
    allParams: Object.fromEntries(requestUrl.searchParams.entries())
  });

  if (code) {
    const supabase = await createClient();
    console.log("🔥 Exchanging code for session...");
    
    // Exchange OAuth code for user session
    const result = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("🔥 Session exchange result:", {
      hasSession: !!result.data.session,
      hasUser: !!result.data.user,
      error: result.error?.message
    });
  }

  // ✅ Redirect to dashboard (or custom redirect_to) after OAuth completion
  const redirectTo = redirect_to || "/dashboard";
  const finalUrl = new URL(redirectTo, requestUrl.origin);
  
  console.log("🔥 Final redirect:", {
    redirectTo,
    finalUrl: finalUrl.toString(),
    origin: requestUrl.origin
  });
  
  return NextResponse.redirect(finalUrl);
} 