/**
 * Docs Layout — Responsive layout wrapping all /docs/* pages.
 * Desktop: Three-column with sticky sidebar. Mobile: full-width with dropdown nav.
 */
import DocsSidebar from '@/components/docs/DocsSidebar';
import DocsMobileNav from '@/components/docs/DocsMobileNav';

export const metadata = {
    title: 'Documentation',
    description: 'Learn about Pico — the AI desktop companion by Vaelix. Features, hardware, and technology.',
    alternates: {
        canonical: '/docs',
    },
    openGraph: {
        title: 'Documentation — Pico by Vaelix',
        description: 'Explore Pico documentation: features, hardware, technology stack, and more.',
        url: '/docs',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Documentation — Pico by Vaelix',
        description: 'Explore Pico documentation: features, hardware, technology stack, and more.',
    },
};

export default function DocsLayout({ children }) {
    return (
        <div className="pt-20 min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex gap-8">
                {/* Left Sidebar — hidden on mobile, visible on lg+ */}
                <DocsSidebar />

                {/* Center Content — full width on mobile */}
                <main className="flex-1 min-w-0 max-w-[720px]">
                    {/* Mobile docs navigation dropdown */}
                    <DocsMobileNav />
                    {children}
                </main>

                {/* Right TOC Column (placeholder for future) */}
                <div className="w-48 shrink-0 hidden xl:block" />
            </div>
        </div>
    );
}
