'use client'

import { useId, useState } from 'react'
import type { PublicShortcut } from '@/content/docs'
import { Keys } from './Keys'

const contextLabels: Record<PublicShortcut['context'], string | null> = {
  global: null,
  canvas: 'Glyph editor',
  scripting: 'Scripting window'
}

function matches (shortcut: PublicShortcut, terms: string[]) {
  const haystack = [
    shortcut.action,
    shortcut.keys.join(' '),
    shortcut.keys.join('+'),
    shortcut.menuPath ?? ''
  ].join(' ').toLowerCase()
  return terms.every(term => haystack.includes(term))
}

export function ShortcutsBrowser ({ groups }: { groups: { group: string, items: PublicShortcut[] }[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const inputId = useId()
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  const visible = groups
    .filter(({ group }) => activeGroup === null || group === activeGroup)
    .map(({ group, items }) => ({ group, items: items.filter(item => matches(item, terms)) }))
    .filter(({ items }) => items.length > 0)
  const count = visible.reduce((sum, { items }) => sum + items.length, 0)

  const buttonClass = (active: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      active
        ? 'bg-[#101418] text-white'
        : 'border border-[#dce2e8] bg-white text-[#5f6b77] hover:text-[#101418]'
    }`

  return (
    <div className='mt-8'>
      <div className='flex flex-col gap-4'>
        <div>
          <label htmlFor={inputId} className='sr-only'>Filter shortcuts</label>
          <input
            id={inputId}
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Filter by action, key or menu'
            autoComplete='off'
            className='w-full max-w-md rounded-md border border-[#cfd6dd] bg-white px-4 py-3 text-base text-[#101418] placeholder:text-[#8793a0] focus-visible:border-[#101418]'
          />
        </div>
        <div role='group' aria-label='Show group' className='flex flex-wrap gap-2'>
          <button type='button' aria-pressed={activeGroup === null} onClick={() => setActiveGroup(null)} className={buttonClass(activeGroup === null)}>
            All
          </button>
          {groups.map(({ group }) => (
            <button
              key={group}
              type='button'
              aria-pressed={activeGroup === group}
              onClick={() => setActiveGroup(group)}
              className={buttonClass(activeGroup === group)}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <p className='mt-6 text-sm text-[#5f6b77]' aria-live='polite'>
        {count === 1 ? '1 shortcut' : `${count} shortcuts`}
      </p>

      {visible.map(({ group, items }) => (
        <section key={group} className='mt-8'>
          <h2 className='text-xl font-semibold text-[#101418]'>{group}</h2>
          <div className='mt-3 overflow-x-auto rounded-lg border border-[#dce2e8] bg-white'>
            <table className='w-full border-collapse text-left text-sm'>
              <thead className='bg-[#fbfcfd]'>
                <tr>
                  <th scope='col' className='w-48 border-b border-[#dce2e8] px-4 py-3 font-semibold'>Keys</th>
                  <th scope='col' className='border-b border-[#dce2e8] px-4 py-3 font-semibold'>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(shortcut => (
                  <tr key={shortcut.id} id={shortcut.id} className='scroll-mt-6 border-t border-[#eef1f4] first:border-t-0'>
                    <td className='whitespace-nowrap px-4 py-3 align-top'>
                      <Keys keys={shortcut.keys} />
                    </td>
                    <td className='px-4 py-3 align-top'>
                      <span className='font-medium text-[#101418]'>{shortcut.action}</span>
                      {contextLabels[shortcut.context] && (
                        <span className='ml-2 rounded bg-[#eef1f4] px-1.5 py-0.5 text-xs text-[#5f6b77]'>
                          {contextLabels[shortcut.context]}
                        </span>
                      )}
                      {shortcut.menuPath && (
                        <span className='mt-0.5 block text-xs text-[#5f6b77]'>{shortcut.menuPath}</span>
                      )}
                      {shortcut.note && (
                        <span className='mt-0.5 block text-xs italic text-[#5f6b77]'>{shortcut.note}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
