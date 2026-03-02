/**
 * Docs Index Page — Landing page for /docs
 * Shows all doc categories as cards with links.
 */
import Link from 'next/link';
import { DOCS_NAV } from '@/lib/docs';
import SectionHeader from '@/components/shared/SectionHeader';

export default function DocsIndexPage() {
    return (
        <div>
            <SectionHeader
                badge="Documentation"
                title="Discover PICO"
                subtitle="Learn about the technology, features, and vision behind Pico."
            />

            <div className="space-y-10">
                {DOCS_NAV.map((category) => (
                    <div key={category.category}>
                        <h2 className="text-heading-md text-ink mb-4 font-display">
                            {category.category}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {category.items.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/docs/${item.slug}`}
                                    className="block p-5 bg-warm-white rounded-standard shadow-sm border border-warm-gray-mid/30 hover:shadow-md hover:border-periwinkle/30 transition-all group"
                                >
                                    <h3 className="text-heading-sm text-ink group-hover:text-periwinkle transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-body-sm text-ink-light mt-1">
                                        {item.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
