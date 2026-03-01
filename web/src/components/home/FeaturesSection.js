/**
 * FeaturesSection — Categorized feature grid.
 * Categories: AI & Voice, Vision, Personality, Hardware.
 * Uses tabbed interface (Radix Tabs) to switch categories.
 * Each tab renders a responsive grid of FeatureCards.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import SectionHeader from '@/components/shared/SectionHeader';
import FeatureCard from '@/components/shared/FeatureCard';
import { staggerContainer } from '@/lib/motion';
import { FiCpu, FiEye, FiHeart, FiSettings } from 'react-icons/fi';

/* ─── Feature Data Sourced from docs/Features.md ─── */
const FEATURE_CATEGORIES = {
    ai: {
        label: 'AI & Voice',
        icon: <FiCpu />,
        accentColor: 'var(--periwinkle)',
        features: [
            { id: 'AI-1', title: 'Wake Word Detection', description: '"Hey Pico" trigger via ESP-SR, with offline fallback.' },
            { id: 'AI-2', title: 'Speech-to-Text', description: 'Google Cloud Speech-to-Text with 60-min free tier.' },
            { id: 'AI-3', title: 'Natural Language Processing', description: 'Google Gemini for conversational AI and contextual responses.' },
            { id: 'AI-4', title: 'Sound Bank Communication', description: '20+ expressive WAV files — no TTS, pure personality-driven audio.' },
        ],
    },
    vision: {
        label: 'Vision',
        icon: <FiEye />,
        accentColor: 'var(--teal)',
        features: [
            { id: 'V-1', title: 'Face Detection', description: 'Real-time face detection via ESP-WHO on-device.' },
            { id: 'V-2', title: 'Face Recognition', description: 'Learn and identify up to 10 faces. Greets users by name.' },
            { id: 'V-3', title: 'Presence Tracking', description: 'Tracks user position for head movement and eye tracking.' },
            { id: 'V-4', title: 'Motion Awareness', description: 'Detects sudden motion changes and responds with surprise or curiosity.' },
        ],
    },
    personality: {
        label: 'Personality',
        icon: <FiHeart />,
        accentColor: 'var(--pink-rose)',
        features: [
            { id: 'P-1', title: 'Emotion State Machine', description: '8 distinct emotional states with smooth animated transitions.' },
            { id: 'P-2', title: 'Idle Behaviors', description: 'Random blinking, pupil drift, and sleepy yawns when unattended.' },
            { id: 'P-3', title: 'Touch Response', description: 'Capacitive touch sensor triggers loving or playful responses.' },
            { id: 'P-4', title: 'Time-Aware Greetings', description: 'Different greetings for morning, afternoon, and night.' },
        ],
    },
    hardware: {
        label: 'Hardware',
        icon: <FiSettings />,
        accentColor: 'var(--warm-orange)',
        features: [
            { id: 'H-1', title: 'ESP32-S3-EYE Board', description: 'Dual-core 240MHz, 8MB PSRAM, built-in camera and mic.' },
            { id: 'H-2', title: '0.96″ OLED Display', description: 'Animated eye expressions rendered at 30+ FPS.' },
            { id: 'H-3', title: 'Pan-Tilt Servos', description: '2x SG90 micro servos for head movement tracking.' },
            { id: 'H-4', title: 'MAX98357A Amplifier', description: 'I2S digital audio amplifier for crisp, clear sound playback.' },
        ],
    },
};

const CATEGORY_KEYS = Object.keys(FEATURE_CATEGORIES);

export default function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section id="features" className="py-16 md:py-24 px-6">
            <div className="max-w-[1200px] mx-auto">
                <SectionHeader
                    badge="Capabilities"
                    title="What Pico Can Do"
                    subtitle="A complete AI system packed into a tiny companion."
                />

                <Tabs.Root defaultValue="ai" ref={ref}>
                    {/* Tab List */}
                    <Tabs.List className="flex flex-wrap gap-2 mb-10 justify-center" aria-label="Feature categories">
                        {CATEGORY_KEYS.map((key) => {
                            const cat = FEATURE_CATEGORIES[key];
                            return (
                                <Tabs.Trigger
                                    key={key}
                                    value={key}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-body-sm font-medium 
                    text-ink-light transition-colors cursor-pointer
                    data-[state=active]:bg-periwinkle data-[state=active]:text-white
                    hover:bg-warm-gray-light data-[state=inactive]:border data-[state=inactive]:border-warm-gray-mid"
                                >
                                    {cat.icon}
                                    {cat.label}
                                </Tabs.Trigger>
                            );
                        })}
                    </Tabs.List>

                    {/* Tab Content */}
                    {CATEGORY_KEYS.map((key) => {
                        const cat = FEATURE_CATEGORIES[key];
                        return (
                            <Tabs.Content key={key} value={key}>
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                    initial="initial"
                                    animate={isInView ? 'animate' : 'initial'}
                                    variants={staggerContainer}
                                >
                                    {cat.features.map((feature) => (
                                        <FeatureCard
                                            key={feature.id}
                                            id={feature.id}
                                            title={feature.title}
                                            description={feature.description}
                                            icon={cat.icon}
                                            accentColor={cat.accentColor}
                                        />
                                    ))}
                                </motion.div>
                            </Tabs.Content>
                        );
                    })}
                </Tabs.Root>
            </div>
        </section>
    );
}
