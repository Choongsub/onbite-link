"use client";

import { useMemo, useState } from "react";
import { getFolder, getFolders, initialBookmarks } from "./bookmarkData";
import Header from "./Header";
import LinkGrid from "./LinkGrid";
import Sidebar from "./Sidebar";

export default function BookmarkDashboard({ activeFolderId = "ALL" }: { activeFolderId?: string }) {
  const [bookmarks] = useState(initialBookmarks);
  const activeFolder = getFolder(activeFolderId);
  const activeFolderName = activeFolder?.name ?? "ALL";
  const folders = getFolders(bookmarks);
  const visible = useMemo(() => activeFolder ? bookmarks.filter((item) => item.folder === activeFolder.name) : bookmarks, [activeFolder, bookmarks]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="lg:flex">
        <Sidebar folders={folders} activeFolderId={activeFolderId} total={bookmarks.length} />
        <main id="main" className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex items-end justify-between">
              <div><p className="mb-2 text-[11px] font-bold tracking-[0.18em] text-[#ff6b4a]">MY COLLECTION</p><h1 className="text-[30px] font-[750] tracking-[-0.045em] sm:text-[36px]">{activeFolder ? activeFolder.name : "모든 링크"}</h1><p className="mt-2 text-sm text-[#8d887f]">필요할 때 꺼내 보는 나만의 작은 서랍</p></div>
              <p className="hidden text-sm tabular-nums text-[#aaa59d] sm:block"><span className="font-semibold text-[#49463f]">{visible.length}</span> links</p>
            </div>
            <LinkGrid bookmarks={visible} activeFolder={activeFolderName} />
          </div>
        </main>
      </div>
    </div>
  );
}
