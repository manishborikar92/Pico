/**
 * GetStartedSection — Final CTA section.
 * Large centered card with gradient background (cool glow).
 * Shows quick-start steps and prominent CTA button.
 */
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '@/components/ui/Button';
import PicoFace from '@/components/pico/PicoFace';
import { fadeInUp } from '@/lib/motion';

const QUICK_STEPS = [
    { num: '1', text: 'Clone the PICO repository' },
    { num: '2', text: 'Install Python dependencies' },
    { num: '3', text: 'Run the robot simulator on your PC' },
    { num: '4', text: 'Start modifying the Emotion Engine' },
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

                        <h2 className="text-display-md mt-8 font-bold">Ready to Build?</h2>
                        <p className="text-body-lg opacity-90 mt-3 max-w-lg">
                            Start with zero hardware cost. Perfect your AI on your laptop,
                            then bring it to life on the ESP32.
                        </p>

                        {/* Quick Steps */}
                        <div className="mt-8 w-full max-w-md text-left">
                            {QUICK_STEPS.map((step) => (
                                <div key={step.num} className="flex items-center gap-4 py-2">
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-body-sm font-bold">
                                        {step.num}
                                    </span>
                                    <span className="text-body-sm">{step.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
                            <Button
                                variant="primary"
                                size="lg"
                                href="/docs/development-plan"
                                className="!bg-white !text-periwinkle hover:!bg-white/90"
                            >
                                Read the Docs
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="!text-white !border-white/30 hover:!bg-white/10"
                                href="https://github.com"
                            >
                                View on GitHub
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
