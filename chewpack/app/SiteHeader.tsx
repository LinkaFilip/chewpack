import Link from 'next/link'
import Image from 'next/image'
import { downloadUrl } from './site'

export function SiteHeader ({ showDownload = false }: { showDownload?: boolean }) {
  return (
    <header className='flex items-center justify-between gap-3 pb-5'>
      <Link href='/' className='group inline-flex min-w-0 items-center gap-3'>
        <Image
          src='/favicon.ico'
          alt='Chewpack'
          width={40}
          height={40}
          className='rounded-lg'
        />
        <span>
          <span className='block text-sm font-semibold uppercasetext-[#5f6b77]'>
            Chewpack
          </span>
        </span>
      </Link>
      <nav className='flex shrink-0 items-center gap-1 text-sm sm:gap-2'>
        <Link
          href='/docs'
          className='rounded-md px-2.5 py-2 font-medium sm:px-3 text-[#5f6b77] transition hover:bg-[#101418] hover:text-white'
        >
          Docs
        </Link>
        {showDownload && (
          <a
            href={downloadUrl}
            download
            className='rounded-md bg-[#101418] px-3 py-2.5 font-semibold sm:px-4 text-white transition hover:bg-[#26313a]'
          >
            Download
          </a>
        )}
      </nav>
    </header>
  )
}
