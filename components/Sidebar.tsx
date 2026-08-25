"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteFolderDialog from "./DeleteFolderDialog";
import EditFolderDialog from "./EditFolderDialog";
import { FolderIcon, GridIcon, PencilIcon, PlusIcon, TrashIcon } from "./icons";

export type Folder = { id: string; name: string; count: number; color: string };
type Props = {
  folders: Folder[];
  activeFolderId: string;
  total: number;
  onDeleteFolder?: (folderId: string) => void;
  onRenameFolder?: (folderId: string, name: string) => void;
};

export default function Sidebar({ folders, activeFolderId, total, onDeleteFolder, onRenameFolder }: Props) {
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const hasFolderActions = Boolean(onDeleteFolder || onRenameFolder);
  const itemClass = (selected: boolean) =>
    `nav-item focus-ring flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm ${
      selected
        ? "bg-[var(--surface-hover)] font-medium text-[var(--text)]"
        : "text-[var(--text-sub)]"
    }`;

  return (
    <aside className="border-b border-[var(--border)] bg-[var(--sidebar)] px-3 py-3 lg:w-[240px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-2.5 lg:py-4">
      <nav aria-label="북마크 폴더" className="flex gap-1 overflow-x-auto lg:block lg:space-y-0.5">
        <Link href="/" aria-current={activeFolderId === "ALL" ? "page" : undefined} className={`${itemClass(activeFolderId === "ALL")} min-w-fit lg:min-w-0`}>
          <GridIcon className="size-4 shrink-0" />
          <span className="flex-1">모든 링크</span>
          <span className="text-xs tabular-nums text-[var(--text-faint)]">{total}</span>
        </Link>
        <p className="mb-1 mt-6 hidden px-2.5 text-[11px] font-semibold text-[var(--text-faint)] lg:block">PRIVATE</p>
        {folders.map((folder) => (
          <div key={folder.id} className={`${hasFolderActions ? "folder-row" : ""} relative min-w-fit lg:min-w-0`}>
            <Link href={`/foler/${folder.id}`} aria-current={activeFolderId === folder.id ? "page" : undefined} className={`${itemClass(activeFolderId === folder.id)} ${hasFolderActions ? "pr-[68px]" : ""}`}>
              <FolderIcon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{folder.name}</span>
              <span className="folder-count text-xs tabular-nums text-[var(--text-faint)]">{folder.count}</span>
            </Link>
            {hasFolderActions ? (
              <div className="folder-actions absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                {onRenameFolder ? (
                  <button
                    type="button"
                    className="folder-edit-button focus-ring grid size-7 place-items-center rounded-md text-[var(--text-faint)]"
                    onClick={() => setFolderToEdit(folder)}
                    aria-label={`${folder.name} 폴더 이름 수정`}
                  >
                    <PencilIcon className="size-4" />
                  </button>
                ) : null}
                {onDeleteFolder ? (
                  <button
                    type="button"
                    className="folder-delete-button focus-ring grid size-7 place-items-center rounded-md text-[var(--text-faint)]"
                    onClick={() => setFolderToDelete(folder)}
                    aria-label={`${folder.name} 폴더 삭제`}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
      <Link href="/new" className="utility-button focus-ring mt-1 hidden w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[var(--text-sub)] lg:flex">
        <PlusIcon className="size-4" /> 새 페이지
      </Link>
      <div className="mt-8 hidden border-t border-[var(--border)] px-2.5 pt-4 lg:block">
        <p className="text-xs font-medium text-[var(--text-sub)]">정리 팁</p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-faint)]">다시 찾을 링크만 남겨두면 목록이 더 선명해져요.</p>
      </div>
      {folderToDelete ? (
        <DeleteFolderDialog
          folder={folderToDelete}
          onCancel={() => setFolderToDelete(null)}
          onConfirm={() => {
            onDeleteFolder?.(folderToDelete.id);
            setFolderToDelete(null);
          }}
        />
      ) : null}
      {folderToEdit ? (
        <EditFolderDialog
          folder={folderToEdit}
          onCancel={() => setFolderToEdit(null)}
          onSave={(name) => {
            onRenameFolder?.(folderToEdit.id, name);
            setFolderToEdit(null);
          }}
        />
      ) : null}
    </aside>
  );
}
