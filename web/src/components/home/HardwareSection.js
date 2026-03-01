/**
 * HardwareSection — Showcases the hardware BOM.
 * Responsive grid of ComponentCards with accent-colored top borders.
 * Includes total cost range and "Indian market pricing" note.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import ComponentCard from '@/components/shared/ComponentCard';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { staggerContainer } from '@/lib/motion';

/* ─── Hardware Components Data (from docs/Hardware.md) ─── */
const COMPONENTS = [
    {
        name: 'ESP32-S3-EYE',
        accentColor: 'var(--periwinkle)',
        specs: ['Dual-core 240MHz processor', '8MB PSRAM + 16MB Flash', 'Built-in 2MP camera + microphone'],
        price: '₹4,200 – ₹5,500',
    },
    {
        name: '0.96″ OLED (SSD1306)',
        accentColor: 'var(--teal)',
        specs: ['128×64 I2C display', 'Self-emissive — no backlight', 'Perfect for expressive eye animation'],
        price: '₹150 – ₹300',
    },
    {
        name: '2× SG90 Micro Servo',
        accentColor: 'var(--warm-orange)',
        specs: ['180° rotation range', '1.8 kg·cm torque', 'Pan-tilt head tracking assembly'],
        price: '₹200 – ₹400',
    },
    {
        name: 'MAX98357A Amplifier',
        accentColor: 'var(--lime-green)',
        specs: ['I2S digital audio interface', '3W output power', 'No DAC required — direct ESP32 connection'],
        price: '₹180 – ₹350',
    },
    {
        name: '3W Speaker (40mm)',
        accentColor: 'var(--coral-red)',
        specs: ['4Ω impedance', 'Full-range driver', 'Clear sound for chirps and beeps'],
        price: '₹50 – ₹150',
    },
    {
        name: 'Touch Sensor (TTP223)',
        accentColor: 'var(--lavender)',
        specs: ['Capacitive touch detection', 'Single-pin digital output', 'Pet-petting interaction trigger'],
        price: '₹30 – ₹60',
    },
];

export default function HardwareSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

    return (
        <section id="hardware" className="py-16 md:py-24 px-6">
            <div className="max-w-[1200px] mx-auto">
                <SectionHeader
                    badge="Hardware Platform"
                    title="Built on ESP32-S3"
                    subtitle="Everything you need, at an accessible price point."
                />

                {/* Total cost highlight */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-display-md text-ink font-bold">
                        ₹<AnimatedCounter value={8000} /> – ₹<AnimatedCounter value={10000} />
                    </span>
                    <p className="text-body-sm text-ink-muted mt-2">
                        Total estimated cost • Indian market pricing • Verified suppliers
                    </p>
                </motion.div>

                <motion.div
                    ref={ref}
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {COMPONENTS.map((comp) => (
                        <ComponentCard key={comp.name} {...comp} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
