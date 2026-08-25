import LinkCard, { type Bookmark } from "./LinkCard";

export default function LinkGrid({ bookmarks, activeFolder }: { bookmarks: Bookmark[]; activeFolder: string }) {
  return (
    <section aria-label={`${activeFolder} 링크 목록`}>
      {bookmarks.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {bookmarks.map((bookmark) => <LinkCard key={bookmark.id} bookmark={bookmark} />)}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-[var(--border)] text-center">
          <div>
            <p className="text-3xl">📄</p>
            <p className="mt-3 font-medium">아직 담아둔 링크가 없어요</p>
            <p className="mt-1 text-sm text-[var(--text-sub)]">새 링크를 추가해 보세요.</p>
          </div>
        </div>
      )}
    </section>
  );
}
