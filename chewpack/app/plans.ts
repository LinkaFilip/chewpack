export type PlanId = '3m' | '1y' | 'lifetime'

export type Plan = {
  id: PlanId
  title: string
  price: string
  billing: string
  cadence: string
  subtitle: string
  highlight: string
  mode: 'subscription' | 'payment'
  stripe: {
    mode: 'subscription' | 'payment'
    amount: string
    productName: string
    description: string
    priceEnv?: string
    recurring?: {
      interval: 'month'
      interval_count: string
    }
  }
  features: string[]
}

export const plans: Record<PlanId, Plan> = {
  '3m': {
    id: '3m',
    title: '3-month license',
    price: '20 EUR',
    billing: 'Billed quarterly',
    cadence: 'trial-friendly access',
    subtitle: 'A compact option for one project or a short evaluation cycle.',
    highlight: 'Short commitment',
    mode: 'subscription',
    stripe: {
      mode: 'subscription',
      amount: '2000',
      productName: '3-month license',
      description: 'Chewpack license for 3 months',
      priceEnv: 'STRIPE_PRICE_3M',
      recurring: {
        interval: 'month',
        interval_count: '3'
      }
    },
    features: ['Immediate access', 'All editor tools', 'Best for a single project']
  },
  '1y': {
    id: '1y',
    title: '1-year license',
    price: '60 EUR',
    billing: 'Billed annually',
    cadence: 'billed once for a full year',
    subtitle: 'The strongest value for ongoing work and repeat clients.',
    highlight: 'Best value',
    mode: 'subscription',
    stripe: {
      mode: 'subscription',
      amount: '6000',
      productName: '1-year license',
      description: 'Chewpack license for 1 year',
      priceEnv: 'STRIPE_PRICE_1Y',
      recurring: {
        interval: 'month',
        interval_count: '12'
      }
    },
    features: ['Lower monthly cost', 'Priority support', 'Most popular choice']
  },
  lifetime: {
    id: 'lifetime',
    title: 'Lifetime license',
    price: '149 EUR',
    billing: 'Billed once',
    cadence: 'single purchase, no renewal',
    subtitle: 'Buy once and keep the workflow without renewal pressure.',
    highlight: 'Own it',
    mode: 'payment',
    stripe: {
      mode: 'payment',
      amount: '14900',
      productName: 'Lifetime license',
      description: 'Chewpack lifetime license'
    },
    features: ['No renewal', 'Permanent license', 'Studio-friendly']
  }
}

export const planOrder: PlanId[] = ['3m', '1y', 'lifetime']

export function isPlanId (value: string | undefined): value is PlanId {
  return value === '3m' || value === '1y' || value === 'lifetime'
}
