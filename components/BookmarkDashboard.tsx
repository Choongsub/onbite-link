"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFolder, getFolders, initialBookmarks } from "./bookmarkData";
import Header from "./Header";
import LinkGrid from "./LinkGrid";
import Sidebar, { type Folder } from "./Sidebar";

export default function BookmarkDashboard({ activeFolderId = "ALL" }: { activeFolderId?: string }) {
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>(() => getFolders(initialBookmarks));
  const sourceFolder = getFolder(activeFolderId);
  const activeFolder = folders.find((folder) => folder.id === activeFolderId) ?? sourceFolder;
  const activeFolderName = activeFolder?.name ?? "ALL";
  const visible = sourceFolder
    ? initialBookmarks.filter((item) => item.folder === sourceFolder.name)
    : initialBookmarks;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Header
        onCreateFolder={(name) => {
          setFolders((current) => {
            if (current.some((folder) => folder.name === name)) return current;

            return [
              ...current,
              {
                id: `folder-${Date.now()}`,
                name,
                count: 0,
                color: "#0071e3",
              },
            ];
          });
        }}
      />
      <div className="lg:flex lg:min-h-[calc(100vh-48px)]">
        <Sidebar
          folders={folders}
          activeFolderId={activeFolderId}
          total={initialBookmarks.length}
          onDeleteFolder={(folderId) => {
            setFolders((current) => current.filter((folder) => folder.id !== folderId));
            if (activeFolderId === folderId) router.push("/");
          }}
          onRenameFolder={(folderId, name) => {
            setFolders((current) => {
              if (current.some((folder) => folder.id !== folderId && folder.name === name)) return current;
              return current.map((folder) => folder.id === folderId ? { ...folder, name } : folder);
            });
          }}
        />
        <main id="main" className="min-w-0 flex-1 px-6 pb-16 pt-10 sm:px-10 lg:px-16 lg:pt-14">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-8">
              <span className="mb-5 block text-[44px] leading-none" aria-hidden="true">
                {activeFolder ? "📁" : "🔖"}
              </span>
              <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[var(--text-sub)]">
                개인 링크 모음
              </p>
              <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.035em] sm:text-[36px]">
                {activeFolder ? activeFolder.name : "모든 링크"}
              </h1>
              <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-[var(--text-sub)]">
                읽고 싶고, 기억하고 싶은 페이지를 한곳에 모아두었어요.
              </p>
            </div>
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">링크</span>
                <span className="rounded bg-[var(--surface-muted)] px-2 py-0.5 text-xs tabular-nums text-[var(--text-sub)]">
                  {visible.length}
                </span>
              </div>
              <span className="text-xs text-[var(--text-faint)]">최근 업데이트순</span>
            </div>
            <LinkGrid bookmarks={visible} activeFolder={activeFolderName} />
          </div>
        </main>
      </div>
    </div>
  );
}
