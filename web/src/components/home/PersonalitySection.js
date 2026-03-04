/**
 * PersonalitySection — Explains the Emotion Engine state machine.
 * Shows a state-machine flowchart with input triggers and state transitions.
 * Includes an interactive demo where clicking buttons changes an embedded PicoFace.
 */
'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import PicoFace from '@/components/pico/PicoFace';
import { getExpressionList } from '@/components/pico/expressions';
import { fadeInUp, staggerContainer, cardEntrance } from '@/lib/motion';

/* ─── All emotion states from centralized config (exclude booting) ─── */
const EMOTION_STATES = getExpressionList().filter((s) => s.key !== 'booting').map((s) => ({
    key: s.key,
    label: s.label,
    sublabel: s.trigger,
    color: s.color,
}));

export default function PersonalitySection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [activeExpression, setActiveExpression] = useState('idle');

    return (
        <section id="personality" className="py-16 md:py-24 px-6 bg-warm-gray-light">
            <div className="max-w-[1200px] mx-auto">
                <SectionHeader
                    badge="Personality System"
                    title="A Personality That Breathes"
                    subtitle="PICO's Emotion Engine is a state machine that processes inputs and transitions between emotions — just like a living creature."
                />

                <motion.div
                    ref={ref}
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    variants={staggerContainer}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                    {/* Left — State Machine Grid */}
                    <motion.div variants={fadeInUp}>
                        <h3 className="text-heading-md text-ink mb-6">Emotion States</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {EMOTION_STATES.map((state) => (
                                <motion.button
                                    key={state.key}
                                    variants={cardEntrance}
                                    onClick={() => setActiveExpression(state.key)}
                                    className={`p-3 rounded-standard text-center cursor-pointer transition-all ${activeExpression === state.key
                                        ? 'ring-2 shadow-md'
                                        : 'hover:shadow-sm'
                                        }`}
                                    style={{
                                        backgroundColor: activeExpression === state.key ? state.color + '18' : 'var(--warm-white)',
                                        borderColor: state.color,
                                        ringColor: state.color,
                                    }}
                                >
                                    <span className="text-body-sm font-mono font-medium block" style={{ color: state.color }}>
                                        {state.label}
                                    </span>
                                    <span className="text-caption text-ink-muted block mt-1">{state.sublabel}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="mt-8 p-5 bg-warm-white rounded-standard shadow-sm">
                            <h4 className="text-heading-sm text-ink mb-2">How It Works</h4>
                            <ul className="space-y-2 text-body-sm text-ink-light">
                                <li className="flex items-start gap-2">
                                    <span className="text-periwinkle mt-0.5">→</span>
                                    Sensory inputs (camera, mic, touch) trigger emotion transitions
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal mt-0.5">→</span>
                                    Each state has its own eye expression, sounds, and head movement
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warm-orange mt-0.5">→</span>
                                    Transitions are smooth — half-blink between expressions
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-pink-rose mt-0.5">→</span>
                                    Idle behaviors like random blinking and pupil drift add life
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right — Interactive PicoFace Demo */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col items-center justify-center"
                    >
                        <div className="bg-warm-white rounded-large shadow-lg p-10 flex flex-col items-center gap-6">
                            <span className="text-caption text-ink-muted uppercase tracking-wider">
                                Click a state to see it live
                            </span>
                            <PicoFace
                                size="lg"
                                expression={activeExpression}
                                interactive={true}
                                autoAnimate={false}
                            />
                            <span className="font-mono text-body-md text-periwinkle font-medium">
                                {activeExpression.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
