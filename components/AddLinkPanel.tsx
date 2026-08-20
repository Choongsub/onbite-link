import { useState, type FormEvent } from "react";
import { CloseIcon } from "./icons";
import type { Bookmark } from "./LinkCard";
import type { Folder } from "./Sidebar";

type Props = { folders: Folder[]; onClose: () => void; onSubmit: (bookmark: Bookmark) => void };

export default function AddLinkPanel({ folders, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState(folders[0]?.name ?? "읽을거리");

  function submit(event: FormEvent) {
    event.preventDefault();
    const resolvedUrl = url.startsWith("http") ? url : `https://${url}`;
    let domain = url;
    try { domain = new URL(resolvedUrl).hostname; } catch { /* 입력값을 그대로 표시합니다. */ }
    onSubmit({ id: Date.now(), title, description: "새로 저장한 링크입니다. 나중에 천천히 살펴보세요.", url: resolvedUrl, domain, folder, symbol: title.slice(0, 1).toUpperCase(), color: "#ff6b4a" });
  }

  return (
    <div className="mb-8 rounded-[22px] border border-[#ded8ce] bg-white p-5 shadow-[0_16px_40px_rgba(45,39,29,.07)] sm:p-6">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">새 링크 담기</h2><p className="mt-1 text-xs text-[#918c83]">기억하고 싶은 페이지를 저장하세요.</p></div><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[#f4f1eb] text-[#77736b] hover:text-[#1e1d1a]" aria-label="닫기"><CloseIcon className="size-4" /></button></div>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1.4fr_150px_auto]">
        <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="링크 이름" className="h-11 rounded-xl border border-[#e6e1d8] bg-[#fbfaf7] px-3.5 text-sm outline-none transition focus:border-[#ff6b4a] focus:ring-3 focus:ring-[#ff6b4a]/10" />
        <input required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." className="h-11 rounded-xl border border-[#e6e1d8] bg-[#fbfaf7] px-3.5 text-sm outline-none transition focus:border-[#ff6b4a] focus:ring-3 focus:ring-[#ff6b4a]/10" />
        <select value={folder} onChange={(event) => setFolder(event.target.value)} className="h-11 rounded-xl border border-[#e6e1d8] bg-[#fbfaf7] px-3 text-sm outline-none focus:border-[#ff6b4a]">{folders.map((item) => <option key={item.name}>{item.name}</option>)}</select>
        <button className="h-11 rounded-xl bg-[#ff6b4a] px-5 text-sm font-semibold text-white transition hover:bg-[#ed5737]">저장</button>
      </form>
    </div>
  );
}
