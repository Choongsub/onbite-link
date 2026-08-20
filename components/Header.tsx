import Link from 'next/link';
import { PlusIcon } from './icons';

export default function Header() {
  return (
    <header className='flex h-[82px] items-center justify-between border-b border-[#e6e1d8] px-5 sm:px-8 lg:px-12'>
      <Link href='/' className='group flex items-center gap-3' aria-label='한입 링크 홈'>
        <span className='grid size-9 rotate-[-6deg] place-items-center rounded-[11px] bg-[#ff6b4a] text-lg font-black text-white shadow-[0_5px_14px_rgba(255,107,74,.25)] transition-transform group-hover:rotate-0'>↗</span>
        <span className='text-[19px] font-[750] tracking-[-0.04em]'>한입 링크</span>
      </Link>
      <Link href='/new' className='flex h-11 items-center gap-2 rounded-full bg-[#1e1d1a] px-[18px] text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ff6b4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b4a]'>
        <PlusIcon className='size-[18px]' /> 새 링크
      </Link>
    </header>
  );
}
