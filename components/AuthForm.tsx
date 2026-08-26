import Link from "next/link";

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

        <form className="space-y-5" aria-label={`${copy.title} 양식`}>
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
                className="auth-input h-12 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[16px] outline-none placeholder:text-[var(--text-faint)]"
              />
            </div>
          ) : null}

          <button
            type="button"
            className="auth-submit focus-ring mt-2 h-12 w-full rounded-full bg-[var(--accent)] px-6 text-[16px] font-semibold text-white"
          >
            {copy.button}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[var(--text-sub)]">
          {copy.prompt}{" "}
          <Link href={copy.linkHref} className="auth-text-link focus-ring rounded px-1 py-1 font-semibold text-[var(--accent)]">
            {copy.linkLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}
