/**
 * Card — Base card component.
 * Cream-white background, standard border radius, shadow-md.
 * Accepts accentColor prop for a 3px top border.
 * Hover: shadow elevation + slight translateY.
 *
 * @param {string} [accentColor] – CSS color for top border accent
 * @param {React.ReactNode} children
 */
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DURATION_HOVER } from '@/lib/motion';

export default function Card({ accentColor, children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                'bg-warm-white rounded-standard shadow-md overflow-hidden',
                className
            )}
            style={accentColor ? { borderTop: `3px solid ${accentColor}` } : undefined}
            whileHover={{
                y: -2,
                boxShadow: '0 12px 32px rgba(28, 25, 23, 0.10), 0 4px 8px rgba(28, 25, 23, 0.06)',
                transition: { duration: DURATION_HOVER },
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
