import type { Metadata } from 'next';
import NewLinkWorkspace from '@/components/NewLinkWorkspace';

export const metadata: Metadata = {
  title: '새 링크 저장 | 한입 링크',
  description: '새로운 링크를 폴더에 저장하세요.',
};

export default function NewLinkPage() {
  return <NewLinkWorkspace />;
}
