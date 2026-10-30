import { isValidElement, type ReactNode } from 'react'
import Link from 'next/link'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { CodeBlock } from './CodeBlock'

function textOf (node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

const components: Components = {
  h1: ({ children, id }) => (
    <h1 id={id} className='scroll-mt-6 text-4xl font-semibold leading-tight text-[#101418] sm:text-5xl'>
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2 id={id} className='mt-12 scroll-mt-6 text-2xl font-semibold text-[#101418]'>
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className='mt-8 scroll-mt-6 text-lg font-semibold text-[#101418]'>
      {children}
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4 id={id} className='mt-6 scroll-mt-6 font-semibold text-[#101418]'>
      {children}
    </h4>
  ),
  p: ({ children }) => <p className='mt-4 leading-7 text-[#36424d]'>{children}</p>,
  ul: ({ children }) => <ul className='mt-4 list-disc space-y-2 pl-6 leading-7 text-[#36424d]'>{children}</ul>,
  ol: ({ children }) => <ol className='mt-4 list-decimal space-y-2 pl-6 leading-7 text-[#36424d]'>{children}</ol>,
  li: ({ children }) => <li className='pl-1'>{children}</li>,
  strong: ({ children }) => <strong className='font-semibold text-[#101418]'>{children}</strong>,
  hr: () => <hr className='my-10 border-[#d8dde3]' />,
  blockquote: ({ children }) => (
    <blockquote className='mt-4 border-l-2 border-[#cfd6dd] pl-4 text-[#53616e]'>{children}</blockquote>
  ),
  a: ({ href = '', children }) => {
    const className = 'font-medium text-[#101418] underline decoration-[#9aa6b2] underline-offset-4 hover:decoration-[#101418]'
    if (href.startsWith('/')) return <Link href={href} className={className}>{children}</Link>
    return <a href={href} className={className}>{children}</a>
  },
  // Inline code only: fenced blocks are taken over by `pre` below.
  code: ({ children }) => (
    <code className='rounded bg-[#e9edf1] px-1.5 py-0.5 font-mono text-[0.875em] text-[#101418]'>
      {children}
    </code>
  ),
  pre: ({ children }) => {
    const code = isValidElement<{ className?: string, children?: ReactNode }>(children) ? children : null
    const language = /language-(\w+)/.exec(code?.props.className ?? '')?.[1]
    return <CodeBlock code={textOf(code?.props.children).replace(/\n$/, '')} language={language} />
  },
  table: ({ children }) => (
    <div className='mt-5 overflow-x-auto rounded-lg border border-[#dce2e8] bg-white'>
      <table className='w-full border-collapse text-left text-sm'>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className='bg-[#fbfcfd]'>{children}</thead>,
  th: ({ children }) => (
    <th scope='col' className='border-b border-[#dce2e8] px-4 py-3 font-semibold text-[#101418]'>{children}</th>
  ),
  td: ({ children }) => (
    <td className='border-t border-[#eef1f4] px-4 py-3 align-top leading-6 text-[#36424d]'>{children}</td>
  )
}

export function Markdown ({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
      {source}
    </ReactMarkdown>
  )
}
