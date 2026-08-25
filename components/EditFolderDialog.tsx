"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { CloseIcon, PencilIcon } from "./icons";
import type { Folder } from "./Sidebar";

type Props = {
  folder: Folder;
  onCancel: () => void;
  onSave: (name: string) => void;
};

export default function EditFolderDialog({ folder, onCancel, onSave }: Props) {
  const [name, setName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const folderName = name.trim();
    if (!folderName) return;

    onSave(folderName);
  };

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-folder-title"
        className="dialog-panel w-full max-w-[400px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--dialog-shadow)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 grid size-10 place-items-center rounded-full bg-[var(--surface-muted)] text-[var(--text-sub)]">
              <PencilIcon className="size-5" />
            </div>
            <h2 id="edit-folder-title" className="text-xl font-semibold tracking-[-0.025em]">
              폴더 이름 수정
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-[var(--text-sub)]">
              사이드바에 표시할 새 이름을 입력하세요.
            </p>
          </div>
          <button
            type="button"
            className="icon-button focus-ring grid size-8 shrink-0 place-items-center rounded-full text-[var(--text-sub)]"
            onClick={onCancel}
            aria-label="모달 닫기"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label htmlFor="edit-folder-name" className="mb-2 block text-sm font-medium">
            폴더 이름
          </label>
          <input
            ref={inputRef}
            id="edit-folder-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="dialog-input h-11 w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[15px] outline-none placeholder:text-[var(--text-faint)]"
            maxLength={40}
            autoComplete="off"
          />
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              className="secondary-button focus-ring h-10 rounded-full px-4 text-sm font-medium text-[var(--text-sub)]"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name.trim() === folder.name}
              className="primary-button focus-ring h-10 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              저장
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
