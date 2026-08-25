import { ArrowIcon, MoreIcon } from "./icons";

export type Bookmark = { id: number; title: string; description: string; url: string; domain: string; folder: string; symbol: string; color: string };

export default function LinkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <article className="link-card flex min-h-[190px] flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-semibold text-[var(--text-sub)]" aria-hidden="true">
          {bookmark.symbol}
        </div>
        <button className="icon-button focus-ring grid size-8 shrink-0 place-items-center rounded-md text-[var(--text-faint)]" aria-label={`${bookmark.title} 메뉴`}>
          <MoreIcon className="size-4" />
        </button>
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
    </article>
  );
}
