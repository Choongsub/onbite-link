import LinkCard, { type Bookmark } from "./LinkCard";

export default function LinkGrid({ bookmarks, activeFolder }: { bookmarks: Bookmark[]; activeFolder: string }) {
  return (
    <section aria-label={`${activeFolder} 링크 목록`}>
      {bookmarks.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {bookmarks.map((bookmark) => <LinkCard key={bookmark.id} bookmark={bookmark} />)}
        </div>
      ) : (
        <div className="grid min-h-72 place-items-center rounded-[22px] border border-dashed border-[#d9d3c9] text-center"><div><p className="text-3xl">🍽️</p><p className="mt-3 font-semibold">아직 담아둔 링크가 없어요</p><p className="mt-1 text-sm text-[#918c83]">새 링크를 한입 추가해 보세요.</p></div></div>
      )}
    </section>
  );
}
