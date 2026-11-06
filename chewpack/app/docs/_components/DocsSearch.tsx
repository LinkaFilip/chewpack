'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { Keys } from './Keys'

export type SearchItem = {
  href: string
  title: string
  text: string
  keys?: string[]
  // Lowercased text the query is matched against.
  haystack: string
}

const maxResults = 12

export function DocsSearch ({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  const results = terms.length
    ? items.filter(item => terms.every(term => item.haystack.includes(term)))
    : []

  return (
    <div role='search' className='w-full max-w-2xl'>
      <label htmlFor={inputId} className='sr-only'>Search the docs</label>
      <input
        id={inputId}
        type='search'
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder='Search features and shortcuts'
        autoComplete='off'
        className='w-full rounded-md border border-[#cfd6dd] bg-white px-4 py-3 text-base text-[#101418] placeholder:text-[#8793a0] focus:border-[#101418] focus:outline-none'
      />
      {terms.length > 0 && (
        <div className='mt-2 rounded-lg border border-[#dce2e8] bg-white' aria-live='polite'>
          {results.length === 0
            ? <p className='px-4 py-3 text-sm text-[#5f6b77]'>Nothing matches “{query.trim()}”.</p>
            : (
              <ul className='divide-y divide-[#eef1f4]'>
                {results.slice(0, maxResults).map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className='block px-4 py-3'>
                      <span className='flex flex-wrap items-center gap-2 font-semibold text-[#101418]'>
                        {item.title}
                        {item.keys && <Keys keys={item.keys} className='text-sm' />}
                      </span>
                      <span className='mt-0.5 block text-sm text-[#5f6b77]'>{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              )}
          {results.length > maxResults && (
            <p className='border-t border-[#eef1f4] px-4 py-2 text-xs text-[#5f6b77]'>
              Showing {maxResults} of {results.length}. Add a word to narrow it down.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
