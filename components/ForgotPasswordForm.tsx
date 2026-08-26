"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "@/app/forgot-password/actions";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage("올바른 이메일 주소를 입력해 주세요.");
      setMessage(null);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      const errorCode = await sendPasswordResetEmail(normalizedEmail);
      if (errorCode) {
        setErrorMessage("비밀번호 재설정 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
      } else {
        setMessage("비밀번호 재설정 링크를 이메일로 보냈습니다. 받은편지함을 확인해 주세요.");
      }
    } catch {
      setErrorMessage("비밀번호 재설정 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-14 text-[var(--text)] sm:px-8">
      <section className="w-full max-w-[420px]" aria-labelledby="forgot-password-title">
        <Link href="/login" className="auth-brand focus-ring mx-auto mb-12 flex w-fit items-center gap-2.5 rounded-full px-2 py-1.5">
          <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--text)] text-sm font-bold text-white" aria-hidden="true">한</span>
          <span className="text-[18px] font-semibold tracking-[-0.035em]">한입 링크</span>
        </Link>
        <div className="mb-9 text-center">
          <p className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]">계정에 다시 접근하기</p>
          <h1 id="forgot-password-title" className="text-[40px] font-semibold leading-[1.1] tracking-[-0.04em]">비밀번호 찾기</h1>
          <p className="mt-4 text-[15px] leading-6 text-[var(--text-sub)]">가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="forgot-password-email" className="mb-2 block text-sm font-medium">이메일</label>
            <input id="forgot-password-email" name="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]" />
          </div>
          <button type="submit" disabled={isSubmitting || !email.trim()} className="auth-submit focus-ring mt-2 h-12 w-full rounded-full bg-[var(--accent)] px-6 text-[16px] font-semibold text-white">
            {isSubmitting ? "보내는 중..." : "재설정 링크 보내기"}
          </button>
        </form>
        {message ? <p className="mt-5 rounded-xl bg-[var(--surface-muted)] px-4 py-3 text-sm leading-5 text-[var(--text-sub)]" role="status">{message}</p> : null}
        {errorMessage ? <p className="mt-5 rounded-xl border border-[var(--danger)] bg-[var(--danger-muted)] px-4 py-3 text-sm leading-5 text-[var(--danger)]" role="alert">{errorMessage}</p> : null}
        <p className="mt-7 text-center text-sm text-[var(--text-sub)]"><Link href="/login" className="auth-text-link focus-ring rounded px-1 py-1 font-semibold text-[var(--accent)]">로그인으로 돌아가기</Link></p>
      </section>
    </main>
  );
}
