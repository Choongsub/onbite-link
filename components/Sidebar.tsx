import Link from "next/link";
import { FolderIcon, GridIcon, PlusIcon } from "./icons";

export type Folder = { id: string; name: string; count: number; color: string };
type Props = { folders: Folder[]; activeFolderId: string; total: number };

export default function Sidebar({ folders, activeFolderId, total }: Props) {
  const itemClass = (selected: boolean) => `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${selected ? "bg-[#1e1d1a] font-semibold text-white shadow-sm" : "text-[#625f58] hover:bg-white hover:text-[#1e1d1a]"}`;
  return (
    <aside className="border-b border-[#e6e1d8] px-4 py-5 lg:min-h-[calc(100vh-82px)] lg:w-[244px] lg:shrink-0 lg:border-r lg:border-b-0 lg:px-5 lg:py-8">
      <nav aria-label="북마크 폴더" className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
        <Link href="/" aria-current={activeFolderId === "ALL" ? "page" : undefined} className={`${itemClass(activeFolderId === "ALL")} min-w-fit lg:min-w-0`}>
          <GridIcon className="size-[18px]" /><span className="flex-1">ALL</span><span className={`text-xs ${activeFolderId === "ALL" ? "text-white/55" : "text-[#aaa59d]"}`}>{total}</span>
        </Link>
        <div className="mx-3 my-5 hidden h-px bg-[#e6e1d8] lg:block" />
        <p className="mb-2 hidden px-3 text-[10px] font-bold tracking-[0.18em] text-[#aaa59d] lg:block">FOLDERS</p>
        {folders.map((folder) => (
          <Link key={folder.id} href={`/foler/${folder.id}`} aria-current={activeFolderId === folder.id ? "page" : undefined} className={`${itemClass(activeFolderId === folder.id)} min-w-fit lg:min-w-0`}>
            <FolderIcon className="size-[18px]" style={{ color: activeFolderId === folder.id ? "white" : folder.color }} /><span className="flex-1">{folder.name}</span><span className={`text-xs ${activeFolderId === folder.id ? "text-white/55" : "text-[#aaa59d]"}`}>{folder.count}</span>
          </Link>
        ))}
      </nav>
      <button className="mt-6 hidden w-full items-center gap-2.5 px-3 text-sm font-medium text-[#9b968e] transition hover:text-[#ff6b4a] lg:flex"><PlusIcon className="size-4" /> 폴더 추가</button>
      <div className="mt-12 hidden rounded-2xl border border-[#e6e1d8] bg-white/60 p-4 lg:block"><p className="text-xs font-semibold text-[#615d55]">오늘의 정리 팁</p><p className="mt-1.5 text-xs leading-5 text-[#918c83]">다시 볼 링크만 남기면<br />생각도 가벼워져요.</p></div>
    </aside>
  );
}
