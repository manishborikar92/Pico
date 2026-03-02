/**
 * WhatIsPicoSection — Two-column layout explaining what PICO is.
 * Left: pull-quote + 3 capability cards (Sees / Hears / Feels).
 * Right: expression showcase carousel cycling through PICO expressions.
 */
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import PicoFace from '@/components/pico/PicoFace';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { FiEye, FiMic, FiHeart } from 'react-icons/fi';

/* ─── Expression Carousel Data ─── */
const EXPRESSIONS = [
    { expression: 'idle', label: 'IDLE', trigger: 'Default state', audio: 'Subtle breathing sounds' },
    { expression: 'happy', label: 'HAPPY', trigger: 'Touch Sensor Activated', audio: 'Purring sound 🎵' },
    { expression: 'curious', label: 'CURIOUS', trigger: 'Unknown Face Detected', audio: 'Questioning chirp 🎵' },
    { expression: 'listening', label: 'LISTENING', trigger: 'Wake-Word Heard', audio: 'Acknowledgment bing 🎵' },
    { expression: 'loved', label: 'LOVED', trigger: 'Being Petted', audio: 'Contented purring 🎵' },
    { expression: 'surprised', label: 'SURPRISED', trigger: 'Picked Up Suddenly', audio: 'Startled beep 🎵' },
    { expression: 'sleepy', label: 'SLEEPY', trigger: 'Long Idle Period', audio: 'Soft yawn sound 🎵' },
    { expression: 'confused', label: 'CONFUSED', trigger: 'Command Error', audio: 'Womp-womp sound 🎵' },
];

const CAROUSEL_INTERVAL = 3000;

/* ─── Capability Cards ─── */
const CAPABILITIES = [
    { icon: <FiEye />, color: 'var(--sky-blue)', title: 'It Sees You', desc: 'Face detection and recognition. Knows your face, remembers you.' },
    { icon: <FiMic />, color: 'var(--teal)', title: 'It Hears You', desc: 'Wake-word detection and speech-to-text. Understands your commands.' },
    { icon: <FiHeart />, color: 'var(--pink-rose)', title: 'It Feels Touch', desc: 'Capacitive touch sensor. Pet it and it purrs.' },
];

/* ─── Dot colors matching rainbow palette ─── */
const DOT_COLORS = ['#FF6B6B', '#FF9E40', '#FFCB47', '#7ED957', '#4ECDC4', '#45B7D1', '#8B9CF4', '#C77DFF'];

export default function WhatIsPicoSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    /* Auto-play carousel */
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % EXPRESSIONS.length);
        }, CAROUSEL_INTERVAL);
        return () => clearInterval(interval);
    }, [isPaused]);

    const current = EXPRESSIONS[activeIndex];

    return (
        <section id="what-is-pico" className="py-16 md:py-24 px-6">
            <div className="max-w-[1200px] mx-auto">
                <SectionHeader
                    badge="Core Concept"
                    title="What Is PICO?"
                    subtitle="More than a smart speaker. A companion that truly responds."
                />

                <motion.div
                    ref={ref}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    variants={staggerContainer}
                >
                    {/* Left Column */}
                    <motion.div variants={fadeInUp} className="flex flex-col gap-8">
                        {/* Pull-quote */}
                        <blockquote className="text-heading-md lg:text-heading-lg italic text-ink leading-relaxed">
                            &ldquo;Unlike smart speakers that just answer questions, Pico behaves like a living pet.
                            It&apos;s a non-verbal AI companion that communicates through expressive sounds,
                            animated eyes, and head movements.&rdquo;
                        </blockquote>

                        {/* Capability cards */}
                        <div className="flex flex-col gap-4">
                            {CAPABILITIES.map((cap) => (
                                <motion.div
                                    key={cap.title}
                                    variants={fadeInUp}
                                    className="flex items-start gap-4 p-4 rounded-standard bg-warm-white shadow-sm border border-warm-gray-mid/30"
                                >
                                    <span className="text-2xl mt-0.5" style={{ color: cap.color }}>
                                        {cap.icon}
                                    </span>
                                    <div>
                                        <h3 className="text-heading-sm text-ink">{cap.title}</h3>
                                        <p className="text-body-sm text-ink-light mt-1">{cap.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column — Expression Showcase Carousel */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col items-center"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="bg-warm-white rounded-large shadow-md p-8 w-full max-w-sm flex flex-col items-center gap-6">
                            {/* Face */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current.expression}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <PicoFace size="lg" expression={current.expression} autoAnimate={false} />
                                </motion.div>
                            </AnimatePresence>

                            {/* Labels */}
                            <div className="text-center">
                                <span className="font-mono text-body-sm text-periwinkle font-medium tracking-wider">
                                    {current.label}
                                </span>
                                <p className="text-body-sm text-ink-light mt-1">{current.trigger}</p>
                                <p className="text-caption text-ink-muted mt-1">{current.audio}</p>
                            </div>

                            {/* Navigation dots */}
                            <div className="flex items-center gap-2">
                                {EXPRESSIONS.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className="w-2.5 h-2.5 rounded-full transition-transform duration-200"
                                        style={{
                                            backgroundColor: DOT_COLORS[i % DOT_COLORS.length],
                                            transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                                            opacity: i === activeIndex ? 1 : 0.4,
                                        }}
                                        aria-label={`Show ${EXPRESSIONS[i].label} expression`}
                                    />
                                ))}
                            </div>

                            {/* Prev/Next arrows */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveIndex((prev) => (prev - 1 + EXPRESSIONS.length) % EXPRESSIONS.length)}
                                    className="p-2 rounded-full hover:bg-warm-gray-light transition-colors text-ink-muted hover:text-ink"
                                    aria-label="Previous expression"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setActiveIndex((prev) => (prev + 1) % EXPRESSIONS.length)}
                                    className="p-2 rounded-full hover:bg-warm-gray-light transition-colors text-ink-muted hover:text-ink"
                                    aria-label="Next expression"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
