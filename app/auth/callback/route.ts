import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const nextPath = searchParams.get("next") === "/reset-password" ? "/reset-password" : "/";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash })
      : { error: new Error("Missing recovery token") };

  if (error) {
    return NextResponse.redirect(new URL("/forgot-password?error=invalid_link", request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
