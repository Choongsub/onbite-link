import { ArrowIcon, MoreIcon } from "./icons";

export type Bookmark = { id: number; title: string; description: string; url: string; domain: string; folder: string; symbol: string; color: string };

export default function LinkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <article className="link-row flex items-center gap-3 rounded-md px-2 py-3 sm:gap-4 sm:px-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-sub)]" aria-hidden="true">
        {bookmark.symbol}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-[15px] font-medium tracking-[-0.015em]">{bookmark.title}</h2>
          <span className="hidden shrink-0 rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-[11px] text-[var(--text-sub)] sm:inline">{bookmark.folder}</span>
        </div>
        <p className="mt-0.5 truncate text-[13px] leading-5 text-[var(--text-sub)]">{bookmark.description}</p>
        <p className="mt-1 truncate text-xs text-[var(--text-faint)]">{bookmark.domain}</p>
      </div>
      <button className="icon-button focus-ring hidden size-8 shrink-0 place-items-center rounded-md text-[var(--text-faint)] sm:grid" aria-label={`${bookmark.title} 메뉴`}>
        <MoreIcon className="size-4" />
      </button>
      <a href={bookmark.url} target="_blank" rel="noreferrer" className="focus-ring grid size-8 shrink-0 place-items-center rounded-md text-[var(--text-faint)]" aria-label={`${bookmark.title} 새 창에서 열기`}>
        <ArrowIcon className="link-arrow size-4 opacity-60 transition-opacity" />
      </a>
    </article>
  );
}
