import Link from 'next/link'

export default function CheckoutCancelPage () {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#050814] px-6 text-white'>
      <div className='w-full max-w-2xl rounded-[2.5rem] border border-red-500/20 bg-red-500/10 p-8 text-center md:p-12'>
        <p className='text-sm uppercase tracking-[0.3em] text-red-200/70'>
          Payment unsuccessful
        </p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight md:text-6xl'>
          Payment was unsuccessful.
        </h1>
        <p className='mt-5 text-lg leading-8 text-red-100/75'>
          The checkout was cancelled or the payment did not go through. You can
          return to the root and try again.
        </p>
        <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
          <Link
            href='/checkout'
            className='inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85'
          >
            Try again
          </Link>
          <Link
            href='/'
            className='inline-flex rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10'
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}
