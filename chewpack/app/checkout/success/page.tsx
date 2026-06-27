import Link from 'next/link'

export default function CheckoutSuccessPage () {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#050814] px-6 text-white'>
      <div className='w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 text-center md:p-12'>
        <p className='text-sm uppercase tracking-[0.3em] text-white/35'>
          Payment successful
        </p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight md:text-6xl'>
          Successful payment.
        </h1>
        <p className='mt-5 text-lg leading-8 text-white/65'>
          Your subscription is active. You will be redirected to the root
          shortly.
        </p>
        <Link
          href='/'
          className='mt-8 inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85'
        >
          Return now
        </Link>
        <script
          dangerouslySetInnerHTML={{
            __html: "setTimeout(() => window.location.href = '/', 2500);"
          }}
        />
      </div>
    </main>
  )
}
