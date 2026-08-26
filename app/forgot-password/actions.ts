"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function sendPasswordResetEmail(email: string) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) return "validation_failed";

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  return error?.code ?? null;
}
