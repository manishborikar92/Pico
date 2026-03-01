/**
 * HowItWorksSection — 3-phase development methodology.
 * Phase 1: Simulate, Phase 2: Port, Phase 3: Integrate.
 * Uses StepCard with vertical connecting line between steps.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import StepCard from '@/components/shared/StepCard';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { FiMonitor, FiCpu, FiBox } from 'react-icons/fi';

/* ─── Phase Data ─── */
const PHASES = [
    {
        step: 1,
        title: 'Simulate on PC',
        description:
            'Develop and test 100% of AI functionality on your laptop using Python. Camera, microphone, and speakers simulate the robot hardware. Zero hardware cost to start.',
        accentColor: 'var(--periwinkle)',
        icon: <FiMonitor />,
        bullets: [
            'Python 3.11 + OpenCV + face_recognition',
            'Google Cloud Speech-to-Text + Gemini AI',
            'Sound Bank with 20+ expressive WAV files',
            'Full Emotion Engine state machine',
        ],
    },
    {
        step: 2,
        title: 'Port to Hardware',
        description:
            'Translate validated Python logic to C++ (Arduino framework). Upload firmware to the ESP32-S3-EYE via USB. Same algorithms, embedded performance.',
        accentColor: 'var(--teal)',
        icon: <FiCpu />,
        bullets: [
            'Arduino IDE + ESP-IDF toolchain',
            'ESP-WHO face detection on-device',
            'ESP-SR wake-word recognition',
            'I2S audio + OLED display drivers',
        ],
    },
    {
        step: 3,
        title: 'Integrate & Build',
        description:
            'Assemble the physical robot with 3D-printed shell, servo head tracking, touch sensor, and speaker. Total hardware cost under ₹10,000.',
        accentColor: 'var(--warm-orange)',
        icon: <FiBox />,
        bullets: [
            'ESP32-S3-EYE + 0.96" OLED display',
            'Pan-tilt servo head (2× SG90)',
            'MAX98357A I2S amp + speaker',
            '3D-printed magnetic shell',
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
                    badge="Development Methodology"
                    title="Software-First Approach"
                    subtitle="Perfect your AI on PC before spending a single rupee on hardware."
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
