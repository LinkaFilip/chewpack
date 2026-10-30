import type { Media } from '@/content/docs'

export function MediaList ({ media }: { media: Media[] }) {
  if (!media.length) return null

  return (
    <div className='mt-8 space-y-6'>
      {media.map(item => (
        <figure key={item.src} className='overflow-hidden rounded-lg border border-[#dce2e8] bg-white'>
          {item.type === 'video'
            ? <video src={item.src} controls preload='metadata' aria-label={item.alt} className='w-full' />
            // eslint-disable-next-line @next/next/no-img-element -- src may be any path or URL
            : <img src={item.src} alt={item.alt} loading='lazy' className='w-full' />}
          {item.caption && (
            <figcaption className='border-t border-[#eef1f4] px-4 py-3 text-sm text-[#5f6b77]'>
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
