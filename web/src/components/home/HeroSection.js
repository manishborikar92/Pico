/**
 * HeroSection — Full viewport-height hero with animated PicoFace,
 * headline "Meet Pico.", subtitle, two CTA buttons, and scroll indicator.
 * The period in "Meet Pico." is periwinkle. Radial gradient glow behind face.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PicoFace from '@/components/pico/PicoFace';
import Button from '@/components/ui/Button';
import DoodleBackground from '@/components/shared/DoodleBackground';

/* ─── Animation Timing Constants ─── */
const HEADLINE_DELAY = 1.2;
const SUBTITLE_DELAY = 1.7;
const CTA_DELAY = 2.0;

export default function HeroSection() {
    const [showScroll, setShowScroll] = useState(true);
    const ref = useRef(null);

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 20) setShowScroll(false);
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id="hero"
            ref={ref}
            className="pt-10 relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
        >
            {/* Radial gradient bloom behind face */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 203, 71, 0.12) 0%, transparent 70%)',
                }}
            />

            {/* ── Doodle pattern background ── */}
            <DoodleBackground />

            {/* PicoFace — full boot-up sequence */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <PicoFace size="xl" interactive={true} autoAnimate={true} />
            </motion.div>

            {/* Headline */}
            <motion.h1
                className="text-display-md sm:text-display-lg md:text-display-xl text-ink text-center mt-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: HEADLINE_DELAY, duration: 0.5 }}
            >
                Meet Pico<span className="text-periwinkle">.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="text-body-lg text-ink-light text-center max-w-lg mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: SUBTITLE_DELAY, duration: 0.5 }}
            >
                Your AI companion that sees, hears, and feels.
            </motion.p>

            <motion.p
                className="text-body-md text-ink-muted text-center max-w-md mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: SUBTITLE_DELAY + 0.2, duration: 0.5 }}
            >
                An emotionally responsive desktop robot that communicates
                like a pet — through chirps, expressions, and movement.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: CTA_DELAY, duration: 0.5 }}
            >
                <Button variant="primary" size="lg" href="mailto:info@vaelix.in">
                    Connect With Us
                </Button>
                <Button variant="secondary" size="lg" href="#how-it-works">
                    See How It Works
                </Button>
            </motion.div>

            {/* Scroll Indicator */}
            {showScroll && (
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 8, 0] }}
                    transition={{ delay: 2.5, y: { repeat: Infinity, duration: 1.5 } }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </motion.div>
            )}
        </section>
    );
}
