/**
 * FeatureCard — Displays a single feature.
 * Shows: ID badge (RainbowBadge), icon (color-matched), title, description.
 * On hover: slight rotation (1deg), shadow elevation, ID badge color brightens.
 *
 * @param {string} id          – Feature ID (e.g. "AI-1")
 * @param {string} title       – Feature name
 * @param {string} description – Short description
 * @param {React.ReactNode} icon
 * @param {string} accentColor – One of the rainbow colors
 */
'use client';

import { motion } from 'framer-motion';
import RainbowBadge from './RainbowBadge';
import { cardEntrance, DURATION_HOVER } from '@/lib/motion';

export default function FeatureCard({ id, title, description, icon, accentColor }) {
    return (
        <motion.div
            className="bg-warm-white rounded-standard shadow-sm p-6 flex flex-col gap-3 border border-warm-gray-mid/50"
            variants={cardEntrance}
            whileHover={{
                rotate: 1,
                boxShadow: '0 12px 32px rgba(28, 25, 23, 0.10), 0 4px 8px rgba(28, 25, 23, 0.06)',
                transition: { duration: DURATION_HOVER },
            }}
        >
            <div className="flex items-center gap-3">
                <RainbowBadge>{id}</RainbowBadge>
                {icon && (
                    <span style={{ color: accentColor }} className="text-xl">
                        {icon}
                    </span>
                )}
            </div>
            <h3 className="text-heading-sm text-ink">{title}</h3>
            <p className="text-body-sm text-ink-light">{description}</p>
        </motion.div>
    );
}
