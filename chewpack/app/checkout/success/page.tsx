import Link from 'next/link'

export default function CheckoutSuccessPage () {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4 py-10 text-[#101418] sm:px-6'>
      <section className='w-full max-w-2xl rounded-xl border border-[#d8dde3] bg-white p-6 text-center shadow-sm sm:p-10'>
        <span className='mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#e8f7f7] text-xl font-semibold text-[#126a70]'>
          ✓
        </span>
        <p className='mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#18a0a6]'>
          Payment successful
        </p>
        <h1 className='mt-3 text-4xl font-semibold tracking-normal sm:text-5xl'>
          Payment received.
        </h1>
        <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-[#5f6b77]'>
          Stripe received the checkout result. Your Chewpack license code will
          be emailed after the payment is confirmed by the webhook.
        </p>
        <Link
          href='/'
          className='mt-7 inline-flex rounded-md bg-[#101418] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#26313a]'
        >
          Return home
        </Link>
        <script
          dangerouslySetInnerHTML={{
            __html: "setTimeout(() => window.location.href = '/', 2500);"
          }}
        />
      </section>
    </main>
  )
}
