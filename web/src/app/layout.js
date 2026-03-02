/**
 * Root Layout — Project PICO Website
 * Loads all three Google Fonts (DM Sans, Inter, JetBrains Mono),
 * wraps children with Lenis smooth-scroll provider,
 * and renders the persistent NavBar and Footer.
 */
import { DM_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

import LenisProvider from '@/hooks/useLenis';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';

/* ─── Font Configuration ─── */
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

/* ─── SEO Metadata ─── */
export const metadata = {
  metadataBase: new URL('https://pico.vaelix.in'),
  title: {
    default: 'Pico — AI Desktop Companion by Vaelix',
    template: '%s | Pico by Vaelix',
  },
  description:
    'Pico is an emotionally responsive AI desktop companion that sees, hears, and reacts like a pet. Currently in development by Vaelix.',
  keywords: [
    'AI robot',
    'companion robot',
    'desktop pet',
    'face recognition',
    'Vaelix',
    'emotional AI',
    'AI companion',
    'desktop robot',
    'expressive AI',
  ],
  authors: [{ name: 'Vaelix', url: 'https://www.vaelix.in' }],
  creator: 'Vaelix',
  publisher: 'Vaelix',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    title: 'Pico',
    capable: true,
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Pico — AI Desktop Companion by Vaelix',
    description:
      'A non-verbal AI companion that communicates through expressions, sounds, and movement. A product by Vaelix.',
    type: 'website',
    url: '/',
    siteName: 'Pico by Vaelix',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pico — AI Desktop Companion by Vaelix',
    description:
      'An emotionally responsive AI desktop companion that sees, hears, and reacts like a pet.',
    creator: '@vaelix',
    site: '@vaelix',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <LenisProvider>
          <NavBar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
