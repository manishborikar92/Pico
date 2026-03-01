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
  title: 'Project PICO — AI Desktop Companion Robot',
  description:
    'Build an emotionally responsive AI companion robot that sees, hears, and reacts like a pet. Open-source, ESP32-S3 based, software-first development.',
  keywords: [
    'AI robot',
    'ESP32',
    'companion robot',
    'desktop pet',
    'face recognition',
    'maker project',
  ],
  openGraph: {
    title: 'Project PICO — AI Desktop Companion Robot',
    description:
      'A non-verbal AI companion that communicates through expressions, sounds, and movement.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
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
