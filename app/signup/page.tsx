import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "회원가입 | 한입 링크",
  description: "한입 링크 계정을 만들어 보세요.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
