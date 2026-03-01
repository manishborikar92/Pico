/**
 * DocsSidebar — Left sidebar navigation for the documentation section.
 * Shows categorized nav links with active state highlighting.
 */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DOCS_NAV } from '@/lib/docs';
import { cn } from '@/lib/utils';

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="w-64 shrink-0 hidden lg:block" aria-label="Documentation navigation">
            <div className="sticky top-24 space-y-6 pr-6 border-r border-warm-gray-mid max-h-[calc(100vh-6rem)] overflow-y-auto">
                {DOCS_NAV.map((category) => (
                    <div key={category.category}>
                        <h3 className="text-caption uppercase tracking-wider text-ink-muted font-medium mb-2">
                            {category.category}
                        </h3>
                        <ul className="space-y-1">
                            {category.items.map((item) => {
                                const href = `/docs/${item.slug}`;
                                const isActive = pathname === href;
                                return (
                                    <li key={item.slug}>
                                        <Link
                                            href={href}
                                            className={cn(
                                                'block px-3 py-2 rounded-sharp text-body-sm transition-colors',
                                                isActive
                                                    ? 'bg-periwinkle/10 text-periwinkle font-medium border-l-2 border-periwinkle'
                                                    : 'text-ink-light hover:text-ink hover:bg-warm-gray-light'
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </nav>
    );
}
