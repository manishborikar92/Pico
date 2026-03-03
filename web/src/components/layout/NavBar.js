/**
 * NavBar — Fixed-position navigation bar.
 * Transparent over hero, solid cream + blur when scrolled > 40px.
 * Left: PicoFace sm + "Pico" wordmark. Center: anchor links. Right: CTA button.
 * Mobile: hamburger menu with full-screen Radix Dialog overlay.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import PicoFace from '@/components/pico/PicoFace';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Constants ─── */
const SCROLL_THRESHOLD = 40;
const NAV_LINKS = [
    { label: 'What is Pico', href: '/#what-is-pico' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Hardware', href: '/#hardware' },
    { label: 'Docs', href: '/docs' },
    { label: 'About', href: '/about' },
];

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > SCROLL_THRESHOLD);
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
                scrolled
                    ? 'bg-cream-base/85 backdrop-blur-[12px] border-warm-gray-mid/50'
                    : 'bg-transparent border-transparent'
            )}
        >
            <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3">
                {/* Left: Logo */}
                <a href="/" className="flex items-center gap-2">
                    <PicoFace size="sm" autoAnimate={true} interactive={false} expression="idle" />
                    <span className="text-heading-sm font-bold font-display text-ink">Pico</span>
                </a>

                {/* Center: Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-body-sm text-ink-light hover:text-periwinkle transition-colors relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-periwinkle transition-all duration-200 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Right: CTA */}
                <div className="hidden md:block">
                    <Button variant="primary" size="sm" href="mailto:info@vaelix.in">
                        Contact Us
                    </Button>
                </div>

                {/* Mobile: Hamburger */}
                <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
                    <Dialog.Trigger asChild>
                        <button
                            className="md:hidden flex flex-col gap-1.5 p-2"
                            aria-label="Open navigation menu"
                        >
                            <span className="w-6 h-0.5 bg-ink rounded" />
                            <span className="w-6 h-0.5 bg-ink rounded" />
                            <span className="w-4 h-0.5 bg-ink rounded" />
                        </button>
                    </Dialog.Trigger>

                    <AnimatePresence>
                        {mobileOpen && (
                            <Dialog.Portal forceMount>
                                <Dialog.Overlay asChild>
                                    <motion.div
                                        className="fixed inset-0 bg-ink/40 z-50"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                </Dialog.Overlay>

                                <Dialog.Content asChild>
                                    <motion.div
                                        className="fixed inset-0 z-50 bg-cream-base flex flex-col items-center justify-center gap-8 p-8"
                                        initial={{ opacity: 0, x: '100%' }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: '100%' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Dialog.Close asChild>
                                            <button
                                                className="absolute top-4 right-4 p-2 text-ink"
                                                aria-label="Close navigation menu"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </Dialog.Close>

                                        {NAV_LINKS.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                className="text-heading-lg text-ink hover:text-periwinkle transition-colors"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {link.label}
                                            </a>
                                        ))}

                                        <Button
                                            variant="primary"
                                            size="lg"
                                            href="mailto:info@vaelix.in"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Contact Us
                                        </Button>
                                    </motion.div>
                                </Dialog.Content>
                            </Dialog.Portal>
                        )}
                    </AnimatePresence>
                </Dialog.Root>
            </nav>
        </motion.header>
    );
}
