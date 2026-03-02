/**
 * GetStartedSection — Final CTA section.
 * Large centered card with gradient background (cool glow).
 * Encourages visitors to connect with Vaelix about PICO.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '@/components/ui/Button';
import PicoFace from '@/components/pico/PicoFace';
import { fadeInUp } from '@/lib/motion';

const HIGHLIGHTS = [
    { emoji: '🤖', text: 'AI-powered emotional intelligence' },
    { emoji: '👁️', text: 'Real-time face recognition & tracking' },
    { emoji: '🎵', text: 'Expressive sound-based communication' },
    { emoji: '🧠', text: 'Continuously evolving personality engine' },
];

export default function GetStartedSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section id="get-started" className="py-16 md:py-24 px-6">
            <div className="max-w-[800px] mx-auto">
                <motion.div
                    ref={ref}
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    variants={fadeInUp}
                    className="relative rounded-large overflow-hidden shadow-xl"
                >
                    {/* Gradient background */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: 'linear-gradient(135deg, #45B7D1 0%, #8B9CF4 50%, #C77DFF 100%)',
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-10 md:p-14 flex flex-col items-center text-center text-white">
                        <PicoFace size="md" expression="happy" autoAnimate={true} />

                        <h2 className="text-display-md mt-8 font-bold">Interested in Pico?</h2>
                        <p className="text-body-lg opacity-90 mt-3 max-w-lg">
                            Pico is currently in active development at Vaelix. Get in touch to learn more
                            about the project, partnership opportunities, or to stay updated on our progress.
                        </p>

                        {/* Highlights */}
                        <div className="mt-8 w-full max-w-md text-left">
                            {HIGHLIGHTS.map((item) => (
                                <div key={item.text} className="flex items-center gap-4 py-2">
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-body-sm">
                                        {item.emoji}
                                    </span>
                                    <span className="text-body-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
                            <Button
                                variant="primary"
                                size="lg"
                                href="mailto:info@vaelix.in"
                                className="!bg-white !text-periwinkle hover:!bg-white/90"
                            >
                                Connect With Us
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="!text-white !border-white/30 hover:!bg-white/10"
                                href="https://www.vaelix.in"
                            >
                                Visit Vaelix
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
