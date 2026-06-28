This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

For Netlify, define these variables in the site settings:

- `STRIPE_SECRET_KEY` for the server route at `app/api/stripe/checkout/route.ts`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` for Stripe Elements in `app/checkout/CheckoutClient.tsx`
- `STRIPE_WEBHOOK_SECRET` for `app/api/stripe/webhook/route.ts`
- `STRIPE_PRICE_3M` for the Stripe recurring Price ID attached to the 3-month license Product
- `STRIPE_PRICE_1Y` for the Stripe recurring Price ID attached to the 1-year license Product
- `SUPABASE_URL` for the hosted Postgres/Supabase project used by license persistence
- `SUPABASE_SERVICE_ROLE_KEY` for server-side license table access
- `LICENSE_HASH_SECRET` for hashing license codes, device IDs, and activation tokens
- `RESEND_API_KEY` for license email delivery
- `LICENSE_EMAIL_FROM` for the verified sender address used by license emails
- `LICENSE_REDEEM_BASE_URL` for the redeem/help link in license emails
- `LICENSE_SUPPORT_EMAIL` for the support address in license emails

The `NEXT_PUBLIC_` prefix is required so the public key is available in the browser bundle.

Create the subscription Products and Prices in Stripe Dashboard, then copy the Price IDs that start with `price_` into these variables. The checkout route uses those existing Prices instead of creating Products during checkout.

Before switching Stripe Elements to live mode for EU digital software sales, review whether the PaymentIntent and subscription flows should enable Stripe Tax.

## License Codes

Run `docs/license-schema.sql` in Supabase before enabling live webhooks. Stripe webhook events create one-time license codes after payment, email the raw code once, and store only hashes in the database.

The desktop program should call:

- `POST /api/licenses/redeem` with `{ "code": "...", "deviceId": "...", "appVersion": "..." }`
- `POST /api/licenses/status` with `{ "activationToken": "...", "deviceId": "..." }`

The redeem response contains an activation token and entitlement. The program should store the activation token locally and derive remaining time from the returned `expiresAt`.
