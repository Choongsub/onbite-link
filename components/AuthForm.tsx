"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "login" | "signup";

const content = {
  login: {
    eyebrow: "다시 만나서 반가워요",
    title: "로그인",
    description: "저장해 둔 링크를 이어서 정리해 보세요.",
    button: "로그인",
    prompt: "아직 계정이 없으신가요?",
    linkLabel: "회원가입",
    linkHref: "/signup",
  },
  signup: {
    eyebrow: "링크를 위한 나만의 공간",
    title: "회원가입",
    description: "흩어진 링크를 한곳에 모으는 첫걸음이에요.",
    button: "회원가입",
    prompt: "이미 계정이 있으신가요?",
    linkLabel: "로그인",
    linkHref: "/login",
  },
} as const;

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = content[mode];
  const isSignup = mode === "signup";
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = Boolean(email.trim() && password && (!isSignup || passwordConfirm)) && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setErrorMessage(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("올바른 이메일 주소를 입력해 주세요.");
      return;
    }

    if (isSignup && password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = isSignup
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
          })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

      if (error) {
        setErrorMessage(
          isSignup
            ? getKoreanSignUpError(error.code, error.message)
            : getKoreanLoginError(error.code),
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage(
        `${isSignup ? "회원가입" : "로그인"} 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-14 text-[var(--text)] sm:px-8">
      <section className="w-full max-w-[420px]" aria-labelledby="auth-title">
        <Link
          href="/"
          className="auth-brand focus-ring mx-auto mb-12 flex w-fit items-center gap-2.5 rounded-full px-2 py-1.5"
          aria-label="한입 링크 홈"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--text)] text-sm font-bold text-white" aria-hidden="true">
            한
          </span>
          <span className="text-[18px] font-semibold tracking-[-0.035em]">한입 링크</span>
        </Link>

        <div className="mb-9 text-center">
          <p className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]">
            {copy.eyebrow}
          </p>
          <h1 id="auth-title" className="text-[40px] font-semibold leading-[1.1] tracking-[-0.04em]">
            {copy.title}
          </h1>
          <p className="mt-4 text-[15px] leading-6 text-[var(--text-sub)]">{copy.description}</p>
        </div>

        <form className="space-y-5" aria-label={`${copy.title} 양식`} onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor={`${mode}-email`} className="mb-2 block text-sm font-medium">
              이메일
            </label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]"
            />
          </div>

          <div>
            <label htmlFor={`${mode}-password`} className="mb-2 block text-sm font-medium">
              비밀번호
            </label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]"
            />
          </div>

          {isSignup ? (
            <div>
              <label htmlFor="signup-password-confirm" className="mb-2 block text-sm font-medium">
                비밀번호 확인
              </label>
              <input
                id="signup-password-confirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                placeholder="비밀번호를 한 번 더 입력하세요"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                required
                className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]"
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="auth-submit focus-ring mt-2 h-12 w-full rounded-full bg-[var(--accent)] px-6 text-[16px] font-semibold text-white"
          >
            {isSubmitting ? (isSignup ? "가입 중..." : "로그인 중...") : copy.button}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[var(--text-sub)]">
          {copy.prompt}{" "}
          <Link href={copy.linkHref} className="auth-text-link focus-ring rounded px-1 py-1 font-semibold text-[var(--accent)]">
            {copy.linkLabel}
          </Link>
        </p>
      </section>

      {errorMessage ? (
        <div
          className="auth-toast fixed left-1/2 top-5 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-xl border border-[var(--danger)] bg-[var(--danger-muted)] px-4 py-3 text-sm font-medium leading-5 text-[var(--danger)] shadow-[var(--control-shadow)]"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      ) : null}
    </main>
  );
}

function getKoreanSignUpError(code: string | undefined, message: string) {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일입니다. 로그인해 주세요.";
    case "weak_password":
      return "비밀번호가 너무 약합니다. 더 안전한 비밀번호를 입력해 주세요.";
    case "email_address_invalid":
    case "validation_failed":
      return "올바른 이메일 주소를 입력해 주세요.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "signup_disabled":
      return "현재 회원가입을 이용할 수 없습니다.";
    default:
      if (message.toLowerCase().includes("password")) {
        return "비밀번호 조건을 확인해 주세요.";
      }

      return "회원가입에 실패했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";
  }
}

function getKoreanLoginError(code: string | undefined) {
  switch (code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "email_not_confirmed":
      return "이메일 인증을 완료한 후 로그인해 주세요.";
    case "user_banned":
      return "사용이 제한된 계정입니다. 관리자에게 문의해 주세요.";
    case "over_request_rate_limit":
      return "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "validation_failed":
      return "이메일과 비밀번호를 다시 확인해 주세요.";
    default:
      return "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
  }
}
