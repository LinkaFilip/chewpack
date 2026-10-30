// One key cap per item, separated by a thin space. "+" is avoided as the
// separator because "+" is itself a key (Ctrl + +).
export function Keys ({ keys, className = '' }: { keys: string[], className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-[0.2em] ${className}`}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          className='inline-flex min-w-[1.75em] items-center justify-center rounded-md border border-[#cfd6dd] border-b-2 bg-white px-1.5 py-0.5 font-mono text-[0.85em] font-medium leading-5 text-[#101418]'
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}
