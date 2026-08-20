import { ArrowIcon, MoreIcon } from "./icons";

export type Bookmark = { id: number; title: string; description: string; url: string; domain: string; folder: string; symbol: string; color: string };

export default function LinkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <article className="group flex min-h-[222px] flex-col rounded-[22px] border border-[#e6e1d8] bg-white p-5 shadow-[0_2px_0_rgba(30,29,26,.02)] transition duration-300 hover:-translate-y-1 hover:border-[#d8d1c7] hover:shadow-[0_16px_35px_rgba(45,39,29,.08)]">
      <div className="flex items-start justify-between">
        <div className="grid size-11 place-items-center rounded-[13px] text-lg font-extrabold" style={{ backgroundColor: `${bookmark.color}18`, color: bookmark.color }} aria-hidden="true">{bookmark.symbol}</div>
        <button className="grid size-8 place-items-center rounded-full text-[#aaa59d] transition hover:bg-[#f4f1eb] hover:text-[#1e1d1a]" aria-label={`${bookmark.title} 메뉴`}><MoreIcon className="size-[18px]" /></button>
      </div>
      <h2 className="mt-5 line-clamp-1 text-[16px] font-bold tracking-[-0.025em]">{bookmark.title}</h2>
      <p className="mt-2 line-clamp-2 text-[13px] leading-[1.65] text-[#858078]">{bookmark.description}</p>
      <div className="mt-auto flex items-end justify-between pt-5">
        <span className="max-w-[75%] truncate text-xs font-medium text-[#aaa59d]">{bookmark.domain}</span>
        <a href={bookmark.url} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-full border border-[#e6e1d8] text-[#6d6860] transition group-hover:border-[#1e1d1a] group-hover:bg-[#1e1d1a] group-hover:text-white" aria-label={`${bookmark.title} 새 창에서 열기`}><ArrowIcon className="size-4" /></a>
      </div>
    </article>
  );
}
