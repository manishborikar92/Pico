/**
 * TechStackSection — Visual representation of the technology powering Pico.
 * Reframed as product capabilities rather than development tools.
 * Shows three capability pillars: Intelligence, Communication, Hardware.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import { fadeInUp, staggerContainer, cardEntrance } from '@/lib/motion';

/* ─── Technology Pillars ─── */
const STACK_DATA = [
    {
        title: 'Intelligence',
        subtitle: 'AI & Machine Learning',
        accentColor: 'var(--periwinkle)',
        items: [
            { name: 'Computer Vision', desc: 'Real-time face detection & recognition' },
            { name: 'Speech Recognition', desc: 'Wake-word detection & voice commands' },
            { name: 'Google Gemini AI', desc: 'Natural conversational understanding' },
            { name: 'Emotion Engine', desc: 'Adaptive emotional state machine' },
        ],
    },
    {
        title: 'Communication',
        subtitle: 'Sound & Expression',
        accentColor: 'var(--teal)',
        items: [
            { name: 'Sound Bank', desc: '20+ unique expressive audio clips' },
            { name: 'OLED Display', desc: 'Animated eye expressions at 30+ FPS' },
            { name: 'Head Movement', desc: 'Pan-tilt servo tracking & gestures' },
        ],
    },
    {
        title: 'Hardware Platform',
        subtitle: 'ESP32-S3 Powered',
        accentColor: 'var(--warm-orange)',
        items: [
            { name: 'Dual-Core CPU', desc: '240MHz ESP32-S3 processor' },
            { name: 'On-Device AI', desc: 'Edge computing with 8MB PSRAM' },
            { name: 'Real-Time OS', desc: 'FreeRTOS multitasking for responsive behavior' },
            { name: 'Digital Audio', desc: 'I2S audio output for crisp sound' },
            { name: 'WiFi Connected', desc: 'Cloud AI services via WiFi bridge' },
        ],
    },
];

export default function TechStackSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

    return (
        <section id="tech-stack" className="py-16 md:py-24 px-6 bg-warm-gray-light">
            <div className="max-w-[1200px] mx-auto">
                <SectionHeader
                    badge="Technology"
                    title="Powered By Innovation"
                    subtitle="Cutting-edge AI and embedded systems working together to bring Pico to life."
                />

                <motion.div
                    ref={ref}
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {STACK_DATA.map((column) => (
                        <motion.div
                            key={column.title}
                            variants={cardEntrance}
                            className="bg-warm-white rounded-large shadow-md overflow-hidden"
                        >
                            {/* Header */}
                            <div
                                className="p-5 text-white"
                                style={{ backgroundColor: column.accentColor }}
                            >
                                <h3 className="text-heading-sm font-bold">{column.title}</h3>
                                <p className="text-body-sm opacity-85">{column.subtitle}</p>
                            </div>

                            {/* Items */}
                            <ul className="p-5 space-y-3">
                                {column.items.map((item) => (
                                    <li key={item.name} className="flex items-start gap-3">
                                        <span
                                            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: column.accentColor }}
                                        />
                                        <div>
                                            <span className="text-body-sm font-medium text-ink">{item.name}</span>
                                            <span className="text-body-sm text-ink-muted ml-1">— {item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
