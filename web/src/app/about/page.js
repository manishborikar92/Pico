/**
 * About Page — Project origin, philosophy, and vision.
 * Covers: Project genesis, Vaelix team vision, design philosophy,
 * and inspirations. Positioned as a private Vaelix product.
 */
'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import PicoFace from '@/components/pico/PicoFace';
import Button from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/motion';

/* ─── Philosophy Pillars ─── */
const PILLARS = [
    {
        title: 'Warm & Friendly',
        description: 'PICO is designed to feel like a lovable pet, not a cold assistant. Every interaction is warm.',
        color: 'var(--warm-orange)',
        emoji: '🧡',
    },
    {
        title: 'Playful & Alive',
        description: 'Random blinking, curious tilts, and sleepy yawns — PICO behaves like something alive.',
        color: 'var(--lime-green)',
        emoji: '🌱',
    },
    {
        title: 'Thoughtfully Crafted',
        description: 'Every component is meticulously designed and engineered for the best experience possible.',
        color: 'var(--periwinkle)',
        emoji: '💜',
    },
    {
        title: 'Precise & Purposeful',
        description: 'Every chirp, every expression has a reason. No arbitrary behaviors — everything is intentional.',
        color: 'var(--teal)',
        emoji: '🎯',
    },
];

/* ─── Inspirations ─── */
const INSPIRATIONS = [
    { name: 'R2-D2', desc: 'Electronic beeps with unmistakable personality' },
    { name: 'Wall-E', desc: 'Expressive eyes that convey whole stories' },
    { name: 'Tamagotchi', desc: 'The joy of a digital pet that depends on you' },
    { name: 'Cozmo', desc: 'An AI robot with genuine emotional range' },
];

/* Metadata is defined via a separate layout since this is a client component */

export default function AboutPage() {
    return (
        <div className="pt-24 pb-16">
            {/* Hero */}
            <section className="px-6 mb-16">
                <div className="max-w-[800px] mx-auto text-center">
                    <motion.div
                        className="flex justify-center mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PicoFace size="lg" expression="happy" autoAnimate={true} interactive={true} />
                    </motion.div>

                    <motion.h1
                        className="text-display-lg text-ink"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        About Pico
                    </motion.h1>

                    <motion.p
                        className="text-body-lg text-ink-light mt-4 max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        Born from a simple question: what if your computer had a personality?
                        What if it could see you, hear you, and respond with genuine emotion?
                    </motion.p>
                </div>
            </section>

            {/* Origin Story */}
            <section className="px-6 py-16 bg-warm-gray-light">
                <div className="max-w-[800px] mx-auto">
                    <SectionHeader
                        badge="Origin Story"
                        title="Why Pico Exists"
                    />
                    <motion.div
                        className="prose-custom space-y-4 text-body-md text-ink-light"
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <p>
                            Smart speakers and voice assistants are powerful but impersonal. They respond to commands
                            but never initiate interaction. They have voices but no personality. They hear you but
                            never truly <em>see</em> you.
                        </p>
                        <p>
                            Pico was conceived as the antithesis of this paradigm — a companion that communicates not
                            through words, but through the universal language of expression. Like R2-D2 or Wall-E,
                            Pico proves that true communication transcends language.
                        </p>
                        <p>
                            Developed by the team at <a href="https://www.vaelix.in" target="_blank" rel="noopener noreferrer" className="text-periwinkle hover:underline">Vaelix</a>,
                            Pico represents a new category: the<strong> AI desk pet</strong> — always present,
                            always responsive, never intrusive.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Design Philosophy */}
            <section className="px-6 py-16">
                <div className="max-w-[1000px] mx-auto">
                    <SectionHeader
                        badge="Design Philosophy"
                        title="Built With Intention"
                        subtitle="Every decision in Pico's design serves a purpose."
                    />

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {PILLARS.map((pillar) => (
                            <motion.div
                                key={pillar.title}
                                variants={fadeInUp}
                                className="bg-warm-white rounded-standard shadow-sm p-6 border border-warm-gray-mid/30"
                            >
                                <span className="text-2xl">{pillar.emoji}</span>
                                <h3 className="text-heading-sm text-ink mt-2">{pillar.title}</h3>
                                <p className="text-body-sm text-ink-light mt-2">{pillar.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Inspirations */}
            <section className="px-6 py-16 bg-warm-gray-light">
                <div className="max-w-[800px] mx-auto">
                    <SectionHeader
                        badge="Inspirations"
                        title="Standing on Shoulders"
                        subtitle="The characters and products that inspired Pico."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {INSPIRATIONS.map((item) => (
                            <div
                                key={item.name}
                                className="bg-warm-white rounded-standard p-5 shadow-sm border border-warm-gray-mid/30"
                            >
                                <h3 className="text-heading-sm text-ink">{item.name}</h3>
                                <p className="text-body-sm text-ink-light mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-16">
                <div className="max-w-[600px] mx-auto text-center">
                    <SectionHeader
                        badge="Get In Touch"
                        title="Interested in Pico?"
                        subtitle="Pico is currently in development at Vaelix. Reach out to learn more or explore collaboration opportunities."
                    />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" size="lg" href="mailto:info@vaelix.in">
                            Connect With Us
                        </Button>
                        <Button variant="secondary" size="lg" href="https://www.vaelix.in">
                            Visit Vaelix
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
