import Link from 'next/link'

export default function CheckoutCancelPage () {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4 py-10 text-[#101418] sm:px-6'>
      <section className='w-full max-w-2xl rounded-xl border border-[#d8dde3] bg-white p-6 text-center shadow-sm sm:p-10'>
        <span className='mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#fff1f1] text-xl font-semibold text-[#9d1c1c]'>
          !
        </span>
        <p className='mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#9d1c1c]'>
          Payment unsuccessful
        </p>
        <h1 className='mt-3 text-4xl font-semibold tracking-normal sm:text-5xl'>
          Payment did not complete.
        </h1>
        <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-[#5f6b77]'>
          The checkout was cancelled or the payment did not go through. You can
          return to checkout and try again.
        </p>
        <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
          <Link
            href='/checkout'
            className='rounded-md bg-[#101418] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#26313a]'
          >
            Try again
          </Link>
          <Link
            href='/'
            className='rounded-md border border-[#c6ced7] bg-white px-5 py-3 text-sm font-semibold text-[#101418] transition hover:border-[#101418]'
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}
