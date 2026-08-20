import { notFound } from "next/navigation";
import BookmarkDashboard from "@/components/BookmarkDashboard";
import { getFolder } from "@/components/bookmarkData";

export default async function FolderPage({ params }: PageProps<"/foler/[folderId]">) {
  const { folderId } = await params;

  if (!getFolder(folderId)) {
    notFound();
  }

  return <BookmarkDashboard activeFolderId={folderId} />;
}
