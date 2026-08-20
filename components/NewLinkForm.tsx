'use client';

import { useState, type FormEvent } from 'react';
import { FolderIcon } from './icons';
import type { Folder } from './Sidebar';

export default function NewLinkForm({ folders }: { folders: Folder[] }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState(folders[0]?.name ?? '읽을거리');
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  function updateField(update: () => void) {
    setSaved(false);
    update();
  }

  return (
    <form onSubmit={submit} className='rounded-[24px] border border-[#e2ddd4] bg-white p-5 shadow-[0_18px_50px_rgba(45,39,29,.07)] sm:p-8'>
      <div className='grid gap-7'>
        <label className='grid gap-2.5'>
          <span className='text-sm font-semibold text-[#49463f]'>링크 이름</span>
          <input
            required
            value={title}
            onChange={(event) => updateField(() => setTitle(event.target.value))}
            placeholder='기억하기 쉬운 이름을 입력하세요'
            className='h-13 rounded-[14px] border border-[#ded8ce] bg-[#fbfaf7] px-4 text-[15px] outline-none transition placeholder:text-[#b1aca4] focus:border-[#ff6b4a] focus:bg-white focus:ring-3 focus:ring-[#ff6b4a]/10'
          />
        </label>

        <label className='grid gap-2.5'>
          <span className='text-sm font-semibold text-[#49463f]'>URL</span>
          <input
            required
            type='url'
            value={url}
            onChange={(event) => updateField(() => setUrl(event.target.value))}
            placeholder='https://example.com'
            className='h-13 rounded-[14px] border border-[#ded8ce] bg-[#fbfaf7] px-4 text-[15px] outline-none transition placeholder:text-[#b1aca4] focus:border-[#ff6b4a] focus:bg-white focus:ring-3 focus:ring-[#ff6b4a]/10'
          />
        </label>

        <label className='grid gap-2.5'>
          <span className='text-sm font-semibold text-[#49463f]'>폴더</span>
          <span className='relative'>
            <FolderIcon className='pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#ff6b4a]' />
            <select
              value={folder}
              onChange={(event) => updateField(() => setFolder(event.target.value))}
              className='h-13 w-full appearance-none rounded-[14px] border border-[#ded8ce] bg-[#fbfaf7] pr-11 pl-11 text-[15px] outline-none transition focus:border-[#ff6b4a] focus:bg-white focus:ring-3 focus:ring-[#ff6b4a]/10'
            >
              {folders.map((item) => <option key={item.name}>{item.name}</option>)}
            </select>
            <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-[#8d887f]'>▼</span>
          </span>
        </label>
      </div>

      <div className='mt-8 border-t border-[#eeeae3] pt-6'>
        <button className='flex h-13 w-full items-center justify-center rounded-[14px] bg-[#ff6b4a] px-6 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,107,74,.22)] transition hover:-translate-y-0.5 hover:bg-[#ed5737] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b4a]'>
          저장하기
        </button>
        <p aria-live='polite' className={`mt-3 min-h-5 text-center text-xs font-medium ${saved ? 'text-[#39745b]' : 'text-[#918c83]'}`}>
          {saved ? '링크를 저장했어요.' : '입력한 링크는 선택한 폴더에 저장됩니다.'}
        </p>
      </div>
    </form>
  );
}
