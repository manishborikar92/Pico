/**
 * StepCard — For the 3-phase development methodology section.
 * Large card with: big step number, title, description, and a content slot.
 *
 * @param {number} step        – Step number (1, 2, 3)
 * @param {string} title       – Step title
 * @param {string} description – Step description paragraph
 * @param {string} accentColor – Accent color for step number
 * @param {React.ReactNode} [icon] – Optional icon
 * @param {React.ReactNode} [children] – Content slot (code block, checklist, etc.)
 */
'use client';

import { motion } from 'framer-motion';
import { cardEntrance } from '@/lib/motion';

export default function StepCard({ step, title, description, accentColor, icon, children }) {
    return (
        <motion.div
            variants={cardEntrance}
            className="bg-warm-white rounded-large shadow-md p-8 flex flex-col gap-4 border border-warm-gray-mid/30"
        >
            <div className="flex items-center gap-4">
                <span
                    className="text-display-lg font-bold"
                    style={{ color: accentColor }}
                >
                    {step}
                </span>
                {icon && (
                    <span className="text-2xl" style={{ color: accentColor }}>
                        {icon}
                    </span>
                )}
            </div>

            <h3 className="text-heading-lg text-ink">{title}</h3>
            <p className="text-body-md text-ink-light">{description}</p>

            {children && (
                <div className="mt-2">
                    {children}
                </div>
            )}
        </motion.div>
    );
}
