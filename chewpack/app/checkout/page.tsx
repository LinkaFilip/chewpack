import CheckoutClient from './CheckoutClient'

type SearchParams = {
  plan?: string | string[]
}

export default function CheckoutPage ({
  searchParams
}: {
  searchParams?: SearchParams
}) {
  const planId = Array.isArray(searchParams?.plan)
    ? searchParams?.plan[0]
    : searchParams?.plan

  return <CheckoutClient planId={planId} />
}
