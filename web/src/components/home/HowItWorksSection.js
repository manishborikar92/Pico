/**
 * HowItWorksSection — Explains how Pico works as a product.
 * Shows the three core capabilities: Sense, Think, Express.
 * Uses StepCard with vertical connecting line between steps.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import StepCard from '@/components/shared/StepCard';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { FiEye, FiCpu, FiSmile } from 'react-icons/fi';

/* ─── How Pico Works Data ─── */
const PHASES = [
    {
        step: 1,
        title: 'Sense the World',
        description:
            'Pico uses an integrated camera and microphone to perceive its surroundings. It detects faces, recognizes people, hears your voice, and senses touch — always aware and attentive.',
        accentColor: 'var(--periwinkle)',
        icon: <FiEye />,
        bullets: [
            'Real-time face detection & recognition',
            'Wake-word and voice command listening',
            'Touch-sensitive interaction via capacitive sensor',
            'Motion and presence awareness',
        ],
    },
    {
        step: 2,
        title: 'Think & Feel',
        description:
            'At Pico\'s core is an advanced Emotion Engine — a state machine that processes sensory inputs and determines the appropriate emotional response, creating lifelike behavior.',
        accentColor: 'var(--teal)',
        icon: <FiCpu />,
        bullets: [
            '8 distinct emotional states with smooth transitions',
            'Contextual AI processing via Google Gemini',
            'Time-aware greetings and adaptive behavior',
            'Natural idle behaviors — blinking, drifting, yawning',
        ],
    },
    {
        step: 3,
        title: 'Express & Respond',
        description:
            'Pico communicates not through words, but through the universal language of expression — animated eyes, expressive chirps, and lifelike head movement that feel genuinely alive.',
        accentColor: 'var(--warm-orange)',
        icon: <FiSmile />,
        bullets: [
            'Animated OLED eye expressions at 30+ FPS',
            '20+ unique sound effects for every emotion',
            'Pan-tilt servo head tracking and movement',
            'Personality-driven responses — never robotic',
        ],
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

    return (
        <section id="how-it-works" className="py-16 md:py-24 px-6 bg-warm-gray-light">
            <div className="max-w-[1200px] mx-auto">
                <SectionHeader
                    badge="How It Works"
                    title="Sense. Think. Express."
                    subtitle="Pico's three-stage intelligence pipeline brings it to life."
                />

                <motion.div
                    ref={ref}
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    variants={staggerContainer}
                    className="relative"
                >
                    {/* Vertical connecting line (hidden on mobile) */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-warm-gray-mid -translate-x-1/2 z-0" />

                    <div className="flex flex-col gap-10 relative z-10">
                        {PHASES.map((phase) => (
                            <StepCard
                                key={phase.step}
                                step={phase.step}
                                title={phase.title}
                                description={phase.description}
                                accentColor={phase.accentColor}
                                icon={phase.icon}
                            >
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {phase.bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-start gap-2 text-body-sm text-ink-light">
                                            <span
                                                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{ backgroundColor: phase.accentColor }}
                                            />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </StepCard>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
