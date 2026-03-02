/**
 * Docs Layout — Three-column layout wrapping all /docs/* pages.
 * Left: DocsSidebar (sticky). Center: page content. Right: reserved for future TOC.
 */
import DocsSidebar from '@/components/docs/DocsSidebar';

export const metadata = {
    title: 'Documentation — Pico by Vaelix',
    description: 'Learn about Pico — the AI desktop companion by Vaelix.',
};

export default function DocsLayout({ children }) {
    return (
        <div className="pt-20 min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 py-8 flex gap-8">
                {/* Left Sidebar */}
                <DocsSidebar />

                {/* Center Content */}
                <main className="flex-1 min-w-0 max-w-[720px]">
                    {children}
                </main>

                {/* Right TOC Column (placeholder for future) */}
                <div className="w-48 shrink-0 hidden xl:block" />
            </div>
        </div>
    );
}
