import Header from './Header';
import NewLinkForm from './NewLinkForm';
import Sidebar, { type Folder } from './Sidebar';

const folders: Folder[] = [
  { id: 'design', name: '디자인', count: 2, color: '#ff6b4a' },
  { id: 'development', name: '개발', count: 2, color: '#168fa8' },
  { id: 'reading', name: '읽을거리', count: 2, color: '#b56e3b' },
  { id: 'inspiration', name: '영감', count: 2, color: '#39745b' },
];

export default function NewLinkWorkspace() {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='lg:flex'>
        <Sidebar folders={folders} activeFolderId='' total={8} />
        <main id='main' className='min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12'>
          <div className='mx-auto max-w-[760px]'>
            <div className='mb-8'>
              <p className='mb-2 text-[11px] font-bold tracking-[0.18em] text-[#ff6b4a]'>NEW BOOKMARK</p>
              <h1 className='text-[30px] font-[750] tracking-[-0.045em] sm:text-[36px]'>새 링크 저장</h1>
              <p className='mt-2 text-sm leading-6 text-[#8d887f]'>나중에 다시 찾고 싶은 페이지를 한입 링크에 담아두세요.</p>
            </div>
            <NewLinkForm folders={folders} />
          </div>
        </main>
      </div>
    </div>
  );
}
