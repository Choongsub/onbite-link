"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { saveBookmark } from "./bookmarkStore";
import { FolderIcon } from "./icons";
import type { Folder } from "./Sidebar";

type OpenGraphResponse = {
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
  error?: never;
};

export default function NewLinkForm({ folders }: { folders: Folder[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState(folders[0]?.name ?? "읽을거리");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("URL을 확인하면 페이지 정보가 자동으로 저장됩니다.");
  const [isError, setIsError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setMessage("페이지 정보를 확인하고 있어요…");

    try {
      const response = await fetch("/api/opengraph", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json() as OpenGraphResponse | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "페이지 정보를 가져오지 못했습니다.");
      }

      const domain = new URL(data.url).hostname.replace(/^www\./, "");
      saveBookmark({
        id: Date.now(),
        title: data.title || domain,
        description: data.description || "설명이 제공되지 않은 링크입니다.",
        thumbnail: data.thumbnail ?? undefined,
        url: data.url,
        domain,
        folder,
        symbol: (data.title || domain).slice(0, 1).toUpperCase(),
        color: "#0071e3",
      });

      setMessage("링크를 저장했어요.");
      router.push("/");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "링크를 저장하지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--dialog-shadow)] sm:p-8">
      <div className="grid gap-6">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[var(--text)]">URL</span>
          <input
            required
            type="text"
            inputMode="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setIsError(false);
              setMessage("URL을 확인하면 페이지 정보가 자동으로 저장됩니다.");
            }}
            placeholder="https://example.com"
            className="dialog-input h-12 rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[15px] outline-none placeholder:text-[var(--text-faint)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[var(--text)]">폴더</span>
          <span className="relative">
            <FolderIcon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--accent)]" />
            <select
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              className="dialog-input h-12 w-full appearance-none rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] pl-11 pr-11 text-[15px] outline-none"
            >
              {folders.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-sub)]">▼</span>
          </span>
        </label>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="primary-button focus-ring flex h-12 w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isLoading ? "확인 중…" : "확인"}
        </button>
        <p aria-live="polite" className={`mt-3 min-h-5 text-center text-xs font-medium ${isError ? "text-[var(--danger)]" : "text-[var(--text-sub)]"}`}>
          {message}
        </p>
      </div>
    </form>
  );
}
