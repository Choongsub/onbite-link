import type { Bookmark } from "./LinkCard";
import type { Folder } from "./Sidebar";

export const initialBookmarks: Bookmark[] = [
  { id: 1, title: "디자인 스펙트럼", description: "디자이너와 개발자가 함께 읽는 프로덕트 디자인 아티클", url: "https://designspectrum.org", domain: "designspectrum.org", folder: "디자인", symbol: "D", color: "#ff6b4a" },
  { id: 2, title: "Mobbin", description: "실제 모바일 앱에서 영감을 얻는 가장 빠른 방법", url: "https://mobbin.com", domain: "mobbin.com", folder: "디자인", symbol: "M", color: "#635bff" },
  { id: 3, title: "React", description: "사용자 인터페이스를 만들기 위한 JavaScript 라이브러리", url: "https://react.dev", domain: "react.dev", folder: "개발", symbol: "⚛", color: "#168fa8" },
  { id: 4, title: "Next.js Docs", description: "웹을 위한 React 프레임워크, Next.js 공식 문서", url: "https://nextjs.org/docs", domain: "nextjs.org", folder: "개발", symbol: "N", color: "#1e1d1a" },
  { id: 5, title: "The Marginalian", description: "과학과 예술, 철학에서 찾은 오래 남는 생각들", url: "https://themarginalian.org", domain: "themarginalian.org", folder: "읽을거리", symbol: "M", color: "#b56e3b" },
  { id: 6, title: "Are.na", description: "아이디어와 이미지를 연결하며 생각을 확장하는 공간", url: "https://www.are.na", domain: "are.na", folder: "영감", symbol: "A", color: "#39745b" },
  { id: 7, title: "Fonts In Use", description: "실제 프로젝트에 사용된 타이포그래피를 찾아보세요", url: "https://fontsinuse.com", domain: "fontsinuse.com", folder: "영감", symbol: "F", color: "#d74f76" },
  { id: 8, title: "Linear Blog", description: "제품을 더 잘 만들기 위한 팀과 시스템에 관한 이야기", url: "https://linear.app/blog", domain: "linear.app", folder: "읽을거리", symbol: "L", color: "#5e62d6" },
];

export const folderMeta = [
  { id: "design", name: "디자인", color: "#ff6b4a" },
  { id: "development", name: "개발", color: "#168fa8" },
  { id: "reading", name: "읽을거리", color: "#b56e3b" },
  { id: "inspiration", name: "영감", color: "#39745b" },
] as const;

export function getFolders(bookmarks: Bookmark[]): Folder[] {
  return folderMeta.map((folder) => ({
    ...folder,
    count: bookmarks.filter((bookmark) => bookmark.folder === folder.name).length,
  }));
}

export function getFolder(folderId?: string) {
  return folderMeta.find((folder) => folder.id === folderId);
}
