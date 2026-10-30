'use client'

import { useState } from 'react'

export function CodeBlock ({ code, language }: { code: string, language?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy () {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className='relative my-5 overflow-hidden rounded-lg border border-[#dce2e8] bg-[#101418]'>
      <div className='flex items-center justify-between border-b border-white/10 px-4 py-1.5'>
        <span className='font-mono text-xs uppercase tracking-[0.14em] text-[#9aa6b2]'>
          {language ?? 'code'}
        </span>
        <button
          type='button'
          onClick={copy}
          className='rounded-md px-2 py-1 text-xs font-semibold text-[#d8dde3] transition hover:bg-white/10 hover:text-white focus-visible:outline-white'
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className='overflow-x-auto p-4 font-mono text-sm leading-6 text-[#eef1f4]'>
        <code>{code}</code>
      </pre>
    </div>
  )
}
