// src/SeoSchema.tsx

const siteUrl = 'https://gumpack.app' // replace with your real domain
const productName = 'Gum Pack'
const price: 20 | null = null // example: "19.00"
const priceCurrency = 'EUR'

const softwareApplication = {
  '@type': 'SoftwareApplication',
  '@id': `${siteUrl}/#software`,
  name: productName,
  url: siteUrl,
  image: `${siteUrl}/og-image.jpg`,
  screenshot: `${siteUrl}/gum-pack-interface.jpg`,
  description:
    'Gum Pack is font creation software for designers, lettering artists and studios who want to draw, refine, test and present original typefaces.',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Windows',
  softwareVersion: 'Early access',
  creator: {
    '@id': `${siteUrl}/#organization`
  },
  featureList: [
    'Glyph drawing and editing',
    'Custom font project saving',
    'Spacing and metrics tools',
    'Live typeface preview',
    'Demo video export with smooth generated cursor'
  ],
  ...(price
    ? {
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency,
          availability: 'https://schema.org/InStock',
          url: siteUrl
        }
      }
    : {})
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Gum Pack',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Gum Pack',
      url: siteUrl,
      publisher: {
        '@id': `${siteUrl}/#organization`
      }
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'Gum Pack — Font Creation Software for Designers',
      description:
        'Create original fonts with Gum Pack. Draw glyphs, refine curves, adjust spacing, test your typeface and export polished demos.',
      isPartOf: {
        '@id': `${siteUrl}/#website`
      },
      about: {
        '@id': `${siteUrl}/#software`
      },
      mainEntity: {
        '@id': `${siteUrl}/#software`
      }
    },
    softwareApplication
  ]
}
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Gum Pack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gum Pack is font creation software for designers who want to create original typefaces instead of only using existing fonts.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who is Gum Pack for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gum Pack is made for graphic designers, brand designers, lettering artists, type-design students, creative freelancers and small studios.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I create a font from my own lettering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gum Pack is designed to help you turn original letterforms into a usable font by drawing, refining, spacing and testing glyphs.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Gum Pack export demo videos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The planned demo export feature lets users create polished product-style videos with smooth generated cursor movement based on real editing actions.'
      }
    }
  ]
}

export function SeoSchema () {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}
