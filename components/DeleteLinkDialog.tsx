"use client";

import { useEffect, useRef } from "react";
import { CloseIcon, TrashIcon } from "./icons";
import type { Bookmark } from "./LinkCard";

type Props = {
  bookmark: Bookmark;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteLinkDialog({ bookmark, onCancel, onConfirm }: Props) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-link-title"
        aria-describedby="delete-link-description"
        className="dialog-panel w-full max-w-[400px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--dialog-shadow)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--danger-muted)] text-[var(--danger)]">
            <TrashIcon className="size-5" />
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

        <h2 id="delete-link-title" className="mt-5 text-xl font-semibold tracking-[-0.025em]">
          링크를 삭제할까요?
        </h2>
        <p id="delete-link-description" className="mt-2 text-sm leading-6 text-[var(--text-sub)]">
          <strong className="font-semibold text-[var(--text)]">{bookmark.title}</strong> 링크가 보관함에서 삭제됩니다.
          이 작업은 되돌릴 수 없습니다.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="secondary-button focus-ring h-10 rounded-full px-4 text-sm font-medium text-[var(--text-sub)]"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="danger-button focus-ring h-10 rounded-full bg-[var(--danger)] px-5 text-sm font-medium text-white"
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}
