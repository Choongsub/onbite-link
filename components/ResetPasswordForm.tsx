"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordForm() {
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage("비밀번호를 변경하지 못했습니다. 재설정 링크를 다시 요청해 주세요.");
        return;
      }
      window.location.replace("/");
    } catch {
      setErrorMessage("비밀번호를 변경하지 못했습니다. 재설정 링크를 다시 요청해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-14 text-[var(--text)] sm:px-8">
      <section className="w-full max-w-[420px]" aria-labelledby="reset-password-title">
        <Link href="/login" className="auth-brand focus-ring mx-auto mb-12 flex w-fit items-center gap-2.5 rounded-full px-2 py-1.5">
          <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--text)] text-sm font-bold text-white" aria-hidden="true">한</span>
          <span className="text-[18px] font-semibold tracking-[-0.035em]">한입 링크</span>
        </Link>
        <div className="mb-9 text-center">
          <p className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]">새 비밀번호 설정</p>
          <h1 id="reset-password-title" className="text-[40px] font-semibold leading-[1.1] tracking-[-0.04em]">비밀번호 재설정</h1>
          <p className="mt-4 text-[15px] leading-6 text-[var(--text-sub)]">새로 사용할 비밀번호를 입력해 주세요.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="reset-password" className="mb-2 block text-sm font-medium">새 비밀번호</label>
            <input id="reset-password" type="password" autoComplete="new-password" placeholder="6자 이상 입력해 주세요" value={password} onChange={(event) => setPassword(event.target.value)} required className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]" />
          </div>
          <div>
            <label htmlFor="reset-password-confirm" className="mb-2 block text-sm font-medium">새 비밀번호 확인</label>
            <input id="reset-password-confirm" type="password" autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력해 주세요" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} required className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]" />
          </div>
          <button type="submit" disabled={isSubmitting || !password || !passwordConfirm} className="auth-submit focus-ring mt-2 h-12 w-full rounded-full bg-[var(--accent)] px-6 text-[16px] font-semibold text-white">{isSubmitting ? "변경 중..." : "비밀번호 변경"}</button>
        </form>
        {errorMessage ? <p className="mt-5 rounded-xl border border-[var(--danger)] bg-[var(--danger-muted)] px-4 py-3 text-sm leading-5 text-[var(--danger)]" role="alert">{errorMessage}</p> : null}
      </section>
    </main>
  );
}
