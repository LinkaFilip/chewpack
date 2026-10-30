import Link from 'next/link'
import Image from 'next/image'
import { downloadUrl } from './site'

export function SiteHeader ({ showDownload = false }: { showDownload?: boolean }) {
  return (
    <header className='flex flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between'>
      <Link href='/' className='group inline-flex items-center gap-3'>
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
      <nav className='flex flex-wrap items-center gap-2 text-sm'>
        <Link
          href='/docs'
          className='rounded-md px-3 py-2 font-medium text-[#5f6b77] transition hover:bg-[#101418] hover:text-white'
        >
          Docs
        </Link>
        {showDownload && (
          <a
            href={downloadUrl}
            download
            className='rounded-md bg-[#101418] px-4 py-2.5 font-semibold text-white transition hover:bg-[#26313a]'
          >
            Download
          </a>
        )}
      </nav>
    </header>
  )
}
