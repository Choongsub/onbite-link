"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { CloseIcon, FolderIcon, PencilIcon } from "./icons";
import type { Bookmark } from "./LinkCard";
import type { Folder } from "./Sidebar";

type Props = {
  bookmark: Bookmark;
  folders: Folder[];
  onCancel: () => void;
  onSave: (changes: Pick<Bookmark, "folder" | "title" | "description">) => void;
};

export default function EditLinkDialog({ bookmark, folders, onCancel, onSave }: Props) {
  const [folder, setFolder] = useState(bookmark.folder);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.select();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({ folder, title: title.trim(), description: description.trim() });
  };

  const hasChanges = (
    folder !== bookmark.folder ||
    title.trim() !== bookmark.title ||
    description.trim() !== bookmark.description
  );

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] px-5 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-link-title"
        className="dialog-panel max-h-full w-full max-w-[460px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--dialog-shadow)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 grid size-10 place-items-center rounded-full bg-[var(--surface-muted)] text-[var(--text-sub)]">
              <PencilIcon className="size-5" />
            </div>
            <h2 id="edit-link-title" className="text-xl font-semibold tracking-[-0.025em]">
              링크 정보 수정
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-[var(--text-sub)]">
              링크의 폴더, 제목과 설명을 수정할 수 있어요.
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

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-medium">폴더</span>
            <span className="relative">
              <FolderIcon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--accent)]" />
              <select
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className="dialog-input h-11 w-full appearance-none rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] pl-11 pr-11 text-[15px] outline-none"
              >
                {folders.map((item) => (
                  <option key={item.id} value={item.storageName ?? item.name}>{item.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-sub)]">▼</span>
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">제목</span>
            <input
              ref={titleRef}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="dialog-input h-11 rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[15px] outline-none"
              maxLength={100}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">설명</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="dialog-input min-h-28 resize-y rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-[15px] leading-6 outline-none"
              maxLength={300}
            />
          </label>

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              className="secondary-button focus-ring h-10 rounded-full px-4 text-sm font-medium text-[var(--text-sub)]"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !hasChanges}
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
