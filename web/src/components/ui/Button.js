/**
 * Button — Brand button component.
 * Variants: primary (periwinkle fill), secondary (outlined), ghost (text only).
 * Sizes: sm, md, lg.
 * All variants have hover scale and shadow elevation.
 *
 * @param {'primary'|'secondary'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {React.ReactNode} children
 * @param {string} [href] – If provided, renders as an anchor tag
 * @param {object} [props] – Any additional props
 */
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DURATION_HOVER } from '@/lib/motion';

const VARIANT_CLASSES = {
    primary:
        'bg-periwinkle text-white border-2 border-transparent hover:shadow-glow-periwinkle',
    secondary:
        'bg-transparent text-periwinkle border-2 border-periwinkle hover:bg-periwinkle/10',
    ghost:
        'bg-transparent text-ink border-2 border-transparent hover:text-periwinkle',
};

const SIZE_CLASSES = {
    sm: 'px-4 py-2 text-body-sm rounded-standard',
    md: 'px-6 py-3 text-body-md rounded-standard',
    lg: 'px-8 py-4 text-body-lg rounded-standard',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    href,
    className,
    ...props
}) {
    const classes = cn(
        'inline-flex items-center justify-center font-medium transition-colors cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
    );

    const motionProps = {
        whileHover: { scale: 1.02, transition: { duration: DURATION_HOVER } },
        whileTap: { scale: 0.98 },
    };

    if (href) {
        return (
            <motion.a href={href} className={classes} {...motionProps} {...props}>
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button className={classes} {...motionProps} {...props}>
            {children}
        </motion.button>
    );
}
