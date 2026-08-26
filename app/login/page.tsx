import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "로그인 | 한입 링크",
  description: "한입 링크에 로그인하세요.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
