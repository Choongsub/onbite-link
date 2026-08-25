import { notFound } from "next/navigation";
import BookmarkDashboard from "@/components/BookmarkDashboard";
import { folderMeta, getFolder } from "@/components/bookmarkData";

export function generateStaticParams() {
  return folderMeta.map((folder) => ({ folderId: folder.id }));
}

export default async function FolderPage({ params }: PageProps<"/foler/[folderId]">) {
  const { folderId } = await params;

  if (!getFolder(folderId)) {
    notFound();
  }

  return <BookmarkDashboard activeFolderId={folderId} />;
}
