import type { Metadata } from 'next'
import { featuresToVerify } from '@/content/docs'
import { SiteHeader } from '../SiteHeader'
import { VerifyNotes } from './_components/VerifyNotes'

export const metadata: Metadata = {
  title: {
    template: '%s — ChewPack Docs',
    default: 'ChewPack Docs'
  }
}

export default function DocsLayout ({ children }: { children: React.ReactNode }) {
  return (
    <main className='min-h-screen select-text bg-[#f4f6f8] text-[#101418]'>
      <div className='mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8'>
        <SiteHeader showDownload />
        <div className='pb-20 pt-6 sm:pt-10'>{children}</div>
      </div>
      {process.env.NODE_ENV === 'development' && <VerifyNotes notes={featuresToVerify()} />}
    </main>
  )
}
