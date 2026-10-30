import type { Metadata } from 'next'
import Link from 'next/link'
import {
  featureHref,
  getShortcut,
  product,
  shortcutGroups,
  shortcuts,
  toPublicShortcut
} from '@/content/docs'
import { Breadcrumbs } from '../_components/Breadcrumbs'
import { Keys } from '../_components/Keys'
import { ShortcutsBrowser } from '../_components/ShortcutsBrowser'

export const metadata: Metadata = {
  title: 'Keyboard shortcuts',
  description: `All ${shortcuts.length} keyboard shortcuts in ${product.name}, grouped and searchable.`
}

const linkClass = 'font-medium text-[#101418] underline decoration-[#9aa6b2] underline-offset-4 hover:decoration-[#101418]'

export default function ShortcutsPage () {
  const groups = shortcutGroups().map(({ group, items }) => ({ group, items: items.map(toPublicShortcut) }))
  const helpKeys = getShortcut('shortcuts-window').keys
  const paletteKeys = getShortcut('command-palette').keys

  return (
    <div className='max-w-4xl'>
      <Breadcrumbs items={[]} />

      <header className='mt-6'>
        <h1 className='text-4xl font-semibold leading-tight sm:text-5xl'>Keyboard shortcuts</h1>
        <p className='mt-4 text-lg leading-8 text-[#53616e]'>
          Every shortcut in {product.name}. Keys use their Windows names.
        </p>
        <p className='mt-3 leading-7 text-[#36424d]'>
          In the app, press <Keys keys={helpKeys} /> to see{' '}
          <Link href={featureHref('shortcuts-window')} className={linkClass}>all shortcuts</Link>, or{' '}
          <Keys keys={paletteKeys} /> to{' '}
          <Link href={featureHref('command-palette')} className={linkClass}>find any command</Link>.
        </p>
      </header>

      <ShortcutsBrowser groups={groups} />
    </div>
  )
}
