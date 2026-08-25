"use client";

import { useState } from "react";
import DeleteLinkDialog from "./DeleteLinkDialog";
import EditLinkDialog from "./EditLinkDialog";
import { deleteBookmark, updateBookmark } from "./bookmarkStore";
import { ArrowIcon, PencilIcon, TrashIcon } from "./icons";
import type { Folder } from "./Sidebar";

export type Bookmark = { id: number; title: string; description: string; url: string; domain: string; folder: string; symbol: string; color: string; thumbnail?: string };

export default function LinkCard({ bookmark, folders }: { bookmark: Bookmark; folders: Folder[] }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <article className="link-card relative flex min-h-[190px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="link-actions absolute right-3 top-3 z-10 flex items-center gap-1">
          <button
            type="button"
            className="link-edit-button focus-ring grid size-8 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-faint)] shadow-[var(--control-shadow)]"
            onClick={() => setIsEditOpen(true)}
            aria-label={`${bookmark.title} 링크 정보 수정`}
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            className="link-delete-button focus-ring grid size-8 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-faint)] shadow-[var(--control-shadow)]"
            onClick={() => setIsDeleteOpen(true)}
            aria-label={`${bookmark.title} 링크 삭제`}
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
        {bookmark.thumbnail ? (
          // Dynamic Open Graph hosts cannot be enumerated in next.config.ts.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bookmark.thumbnail} alt="" className="aspect-[16/8] w-full border-b border-[var(--border)] object-cover" loading="lazy" referrerPolicy="no-referrer" />
        ) : null}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-semibold text-[var(--text-sub)]" aria-hidden="true">
              {bookmark.symbol}
            </div>
          </div>
          <div className="mt-4 min-w-0 flex-1">
            <h2 className="truncate text-[16px] font-semibold tracking-[-0.02em]">{bookmark.title}</h2>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[var(--text-sub)]">{bookmark.description}</p>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-3">
            <span className="min-w-0 flex-1 truncate text-xs text-[var(--text-faint)]">{bookmark.domain}</span>
            <span className="shrink-0 rounded-full bg-[var(--surface-muted)] px-2 py-1 text-[11px] text-[var(--text-sub)]">{bookmark.folder}</span>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="focus-ring grid size-8 shrink-0 place-items-center rounded-md text-[var(--text-faint)]" aria-label={`${bookmark.title} 새 창에서 열기`}>
              <ArrowIcon className="link-arrow size-4 opacity-60 transition-opacity" />
            </a>
          </div>
        </div>
      </article>
      {isDeleteOpen ? (
        <DeleteLinkDialog
          bookmark={bookmark}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            deleteBookmark(bookmark.id);
            setIsDeleteOpen(false);
          }}
        />
      ) : null}
      {isEditOpen ? (
        <EditLinkDialog
          bookmark={bookmark}
          folders={folders}
          onCancel={() => setIsEditOpen(false)}
          onSave={(changes) => {
            updateBookmark({ ...bookmark, ...changes });
            setIsEditOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
