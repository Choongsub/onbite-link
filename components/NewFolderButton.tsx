"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { CloseIcon, FolderIcon } from "./icons";

type Props = {
  onCreate: (name: string) => void;
};

export default function NewFolderButton({ onCreate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const closeDialog = () => {
    setIsOpen(false);
    setName("");
  };

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const folderName = name.trim();
    if (!folderName) return;

    onCreate(folderName);
    closeDialog();
  };

  return (
    <>
      <button
        type="button"
        className="utility-button focus-ring flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-[var(--text-sub)]"
        onClick={() => setIsOpen(true)}
      >
        <FolderIcon className="size-4" />
        <span className="hidden sm:inline">새 폴더</span>
      </button>

      {isOpen ? (
        <div
          className="dialog-backdrop fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] px-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-folder-title"
            className="dialog-panel w-full max-w-[400px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--dialog-shadow)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="new-folder-title" className="text-xl font-semibold tracking-[-0.025em]">
                  새 폴더
                </h2>
                <p className="mt-1.5 text-sm leading-5 text-[var(--text-sub)]">
                  링크를 모아둘 폴더의 이름을 입력하세요.
                </p>
              </div>
              <button
                type="button"
                className="icon-button focus-ring grid size-8 shrink-0 place-items-center rounded-full text-[var(--text-sub)]"
                onClick={closeDialog}
                aria-label="모달 닫기"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            <form className="mt-6" onSubmit={handleSubmit}>
              <label htmlFor="folder-name" className="mb-2 block text-sm font-medium">
                폴더 이름
              </label>
              <input
                ref={inputRef}
                id="folder-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="dialog-input h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[15px] outline-none placeholder:text-[var(--text-faint)]"
                placeholder="예: 나중에 읽기"
                maxLength={40}
                autoComplete="off"
              />
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="secondary-button focus-ring h-10 rounded-full px-4 text-sm font-medium text-[var(--text-sub)]"
                  onClick={closeDialog}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="primary-button focus-ring h-10 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  저장
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
