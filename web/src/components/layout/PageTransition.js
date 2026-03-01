/**
 * PageTransition — Wraps page content with Framer Motion's AnimatePresence.
 * Applies a simple fade transition between page navigations.
 * The background remains cream base during transition to prevent white/black flash.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { pageTransition } from '@/lib/motion';

export default function PageTransition({ children }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                exit={pageTransition.exit}
                style={{ backgroundColor: 'var(--cream-base)' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
