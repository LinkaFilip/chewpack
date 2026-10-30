import Link from 'next/link'

export function Breadcrumbs ({ items }: { items: { href: string, label: string }[] }) {
  return (
    <nav aria-label='Breadcrumb' className='text-sm text-[#5f6b77]'>
      <ol className='flex flex-wrap items-center gap-x-2 gap-y-1'>
        <li>
          <Link href='/docs' className='hover:text-[#101418]'>Docs</Link>
        </li>
        {items.map(item => (
          <li key={item.href} className='flex items-center gap-2'>
            <span aria-hidden='true'>›</span>
            <Link href={item.href} className='hover:text-[#101418]'>{item.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
