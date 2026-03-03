/**
 * SectionHeader — Consistent section title treatment for all home page sections.
 * Renders: a small rainbow Badge (category label), a large heading, and an optional subtitle.
 * Animates in on scroll with the default entrance pattern.
 *
 * @param {string} badge     – Category label text (e.g. "Personality System")
 * @param {string} title     – Large heading text
 * @param {string} [subtitle] – Optional subtitle paragraph
 */
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Badge from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export default function SectionHeader({ badge, title, subtitle, className }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.div
            ref={ref}
            className={`text-center mb-12 md:mb-16 ${className || ''}`}
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
        >
            {badge && (
                <motion.div variants={fadeInUp} className="mb-4">
                    <Badge variant="rainbow">{badge}</Badge>
                </motion.div>
            )}

            <motion.h2
                variants={fadeInUp}
                className="text-display-md md:text-display-lg text-ink"
            >
                {title}
            </motion.h2>

            {subtitle && (
                <motion.p
                    variants={fadeInUp}
                    className="text-body-lg text-ink-light mt-4 max-w-2xl mx-auto"
                >
                    {subtitle}
                </motion.p>
            )}
        </motion.div>
    );
}
