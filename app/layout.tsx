import type { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:  siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [
    'space news', 'space intelligence', 'NASA', 'SpaceX', 'ISRO',
    'ISS tracker', 'launch schedule', 'space missions', 'astronomy',
    'space education', 'antariksham',
  ],
  authors:  [{ name: siteConfig.name, url: siteConfig.url }],
  creator:  siteConfig.name,
  openGraph: {
    type:        'website',
    locale:      siteConfig.locale,
    url:         siteConfig.url,
    siteName:    siteConfig.name,
    title:       siteConfig.seo.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card:        siteConfig.seo.twitterCard,
    site:        siteConfig.twitter,
    creator:     siteConfig.twitter,
    title:       siteConfig.seo.defaultTitle,
    description: siteConfig.description,
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor:  '#07090c',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
