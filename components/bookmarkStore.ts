"use client";

import { useSyncExternalStore } from "react";
import { initialBookmarks } from "./bookmarkData";
import type { Bookmark } from "./LinkCard";

const STORAGE_KEY = "onebite-link:bookmarks";
const CHANGE_EVENT = "onebite-link:bookmarks-changed";
let cachedRaw: string | null = null;
let cachedBookmarks: Bookmark[] = initialBookmarks;

function readSavedBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];

    return value.filter((item): item is Bookmark => (
      typeof item === "object" && item !== null &&
      typeof item.id === "number" && typeof item.title === "string" &&
      typeof item.description === "string" && typeof item.url === "string" &&
      typeof item.domain === "string" && typeof item.folder === "string"
    ));
  } catch {
    return [];
  }
}

function getSnapshot() {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedBookmarks = [...initialBookmarks, ...readSavedBookmarks()];
  }
  return cachedBookmarks;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useBookmarks() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initialBookmarks);
}

export function saveBookmark(bookmark: Bookmark) {
  const saved = readSavedBookmarks().filter((item) => item.url !== bookmark.url);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, bookmark]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
