"use client";

import { useSyncExternalStore } from "react";
import { initialBookmarks } from "./bookmarkData";
import type { Bookmark } from "./LinkCard";

const STORAGE_KEY = "onebite-link:bookmarks";
const DELETED_KEY = "onebite-link:deleted-bookmarks";
const CHANGE_EVENT = "onebite-link:bookmarks-changed";
let cachedKey: string | null = null;
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

function readDeletedBookmarkIds(): number[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(DELETED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  const savedRaw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  const deletedRaw = window.localStorage.getItem(DELETED_KEY) ?? "[]";
  const snapshotKey = `${savedRaw}\n${deletedRaw}`;
  if (snapshotKey !== cachedKey) {
    cachedKey = snapshotKey;
    const deletedIds = new Set(readDeletedBookmarkIds());
    const saved = readSavedBookmarks();
    const savedById = new Map(saved.map((bookmark) => [bookmark.id, bookmark]));
    const initialIds = new Set(initialBookmarks.map((bookmark) => bookmark.id));
    cachedBookmarks = [
      ...initialBookmarks
        .filter((bookmark) => !deletedIds.has(bookmark.id))
        .map((bookmark) => savedById.get(bookmark.id) ?? bookmark),
      ...saved.filter((bookmark) => !initialIds.has(bookmark.id)),
    ];
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

export function deleteBookmark(bookmarkId: number) {
  const saved = readSavedBookmarks().filter((bookmark) => bookmark.id !== bookmarkId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  if (initialBookmarks.some((bookmark) => bookmark.id === bookmarkId)) {
    const deletedIds = new Set(readDeletedBookmarkIds());
    deletedIds.add(bookmarkId);
    window.localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedIds]));
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function updateBookmark(bookmark: Bookmark) {
  const saved = readSavedBookmarks().filter((item) => item.id !== bookmark.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, bookmark]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
