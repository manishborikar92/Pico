/**
 * TechStackSection — Visual representation of the technology stack.
 * Shows two stacks: PC Simulation (Python) and Robot Firmware (C++),
 * plus the Cloud layer connecting them.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import { fadeInUp, staggerContainer, cardEntrance } from '@/lib/motion';

/* ─── Stack Columns ─── */
const STACK_DATA = [
    {
        title: 'PC Simulation',
        subtitle: 'Phase 1 — Python 3.11',
        accentColor: 'var(--periwinkle)',
        items: [
            { name: 'OpenCV', desc: 'Camera & image processing' },
            { name: 'face-recognition', desc: 'Face detection & identification' },
            { name: 'sounddevice', desc: 'Audio recording & playback' },
            { name: 'Google Cloud STT', desc: 'Speech recognition (free tier)' },
            { name: 'Google Gemini', desc: 'Conversational AI' },
        ],
    },
    {
        title: 'Cloud Services',
        subtitle: 'Free Tier APIs',
        accentColor: 'var(--teal)',
        items: [
            { name: 'Speech-to-Text', desc: '60 min/month free' },
            { name: 'Gemini AI', desc: '60 req/minute free' },
            { name: 'WiFi Bridge', desc: 'ESP32 ↔ Cloud' },
        ],
    },
    {
        title: 'Robot Firmware',
        subtitle: 'Phase 2 — C++ (Arduino)',
        accentColor: 'var(--warm-orange)',
        items: [
            { name: 'ESP-WHO', desc: 'On-device face detection' },
            { name: 'ESP-SR', desc: 'Wake-word recognition' },
            { name: 'FreeRTOS', desc: 'Real-time OS multitasking' },
            { name: 'I2S Audio', desc: 'Digital audio output' },
            { name: 'SSD1306 Driver', desc: 'OLED display rendering' },
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
                    title="The Tech Inside"
                    subtitle="A complete AI stack — from Python simulation to embedded firmware."
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
