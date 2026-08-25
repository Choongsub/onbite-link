"use client";

import Link from 'next/link';
import { PlusIcon } from './icons';
import NewFolderButton from './NewFolderButton';

type Props = {
  onCreateFolder?: (name: string) => void;
};

export default function Header({ onCreateFolder }: Props) {
  return (
    <header className='sticky top-0 z-20 flex h-12 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-3 sm:px-4'>
      <Link href='/' className='brand-link focus-ring flex items-center gap-2 rounded-md px-2 py-1.5' aria-label='한입 링크 홈'>
        <span className='grid size-5 place-items-center rounded bg-[var(--text)] text-[11px] font-bold text-white'>↗</span>
        <span className='text-sm font-semibold tracking-[-0.02em]'>한입 링크</span>
      </Link>
      <div className='flex items-center gap-1.5'>
        {onCreateFolder ? <NewFolderButton onCreate={onCreateFolder} /> : null}
        <Link href='/new' className='primary-button focus-ring flex h-8 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-white'>
          <PlusIcon className='size-4' /> 새 링크
        </Link>
      </div>
    </header>
  );
}
