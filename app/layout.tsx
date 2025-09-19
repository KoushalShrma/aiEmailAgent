import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Email Agent - Automate Your Job Applications',
  description: 'Professional AI-powered email generator for job applications. Create personalized, concise emails in seconds with custom templates and bulk processing.',
  keywords: 'AI email generator, job application, cover letter, automated emails, personalized messages',
  authors: [{ name: 'AI Email Agent' }],
  creator: 'AI Email Agent',
  openGraph: {
    title: 'AI Email Agent - Automate Your Job Applications',
    description: 'Professional AI-powered email generator for job applications',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Email Agent',
    description: 'Professional AI-powered email generator for job applications',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
