/**
 * DocsMobileNav — Visible only on small screens (below lg breakpoint).
 * Renders a collapsible dropdown with all doc navigation links,
 * giving mobile users the same navigation the sidebar provides on desktop.
 */
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DOCS_NAV } from '@/lib/docs';
import { cn } from '@/lib/utils';

export default function DocsMobileNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Find the current doc title
    const currentDoc = DOCS_NAV
        .flatMap((cat) => cat.items)
        .find((item) => pathname === `/docs/${item.slug}`);

    return (
        <div className="lg:hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-standard bg-warm-white border border-warm-gray-mid/50 shadow-sm text-body-sm text-ink"
                aria-expanded={isOpen}
                aria-label="Toggle documentation navigation"
            >
                <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-periwinkle">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="font-medium">
                        {currentDoc ? currentDoc.title : 'Documentation'}
                    </span>
                </span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={cn(
                        'text-ink-muted transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <nav className="mt-2 p-3 rounded-standard bg-warm-white border border-warm-gray-mid/30 shadow-sm space-y-4">
                            {DOCS_NAV.map((category) => (
                                <div key={category.category}>
                                    <h4 className="text-caption uppercase tracking-wider text-ink-muted font-medium mb-1.5 px-2">
                                        {category.category}
                                    </h4>
                                    <ul className="space-y-0.5">
                                        {category.items.map((item) => {
                                            const href = `/docs/${item.slug}`;
                                            const isActive = pathname === href;
                                            return (
                                                <li key={item.slug}>
                                                    <Link
                                                        href={href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            'block px-3 py-2 rounded-sharp text-body-sm transition-colors',
                                                            isActive
                                                                ? 'bg-periwinkle/10 text-periwinkle font-medium'
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
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
