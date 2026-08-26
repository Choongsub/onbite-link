"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type LoginCredentials = {
  email: string;
  password: string;
};

export async function loginWithPassword({ email, password }: LoginCredentials) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail || !password) {
    return "validation_failed";
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return error.code ?? "unknown_error";
  }

  revalidatePath("/", "layout");
  return null;
}
