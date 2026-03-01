/**
 * EyeExpression — Renders a single animated eye shape as SVG.
 * Accepts shape (expression), pupil offset, blink state and brightness.
 * Used as a sub-component within PicoFace (composed as left + right eye).
 *
 * @param {string}  shape        – One of: idle, happy, curious-big, curious-small,
 *                                  sleepy, listening, confused-raised, confused-squint,
 *                                  loved, surprised, booting
 * @param {{ x: number, y: number }} pupilOffset – Pixel offset for pupil position
 * @param {boolean} isBlinking   – Whether the eye is in a blink state
 * @param {number}  brightness   – 0–1 brightness multiplier
 */
'use client';

import { motion } from 'framer-motion';

/* ─── Animation Constants ─── */
const BLINK_DURATION = 0.08;
const SPRING_CONFIG = { stiffness: 100, damping: 30 };

/* ─── Eye Shape Definitions (SVG paths drawn in a 60×60 viewBox) ─── */
const EYE_SHAPES = {
    /* idle: large filled circle with small pupil */
    idle: (
        <>
            <circle cx="30" cy="30" r="22" fill="#FDFBF4" />
            <circle className="eye-pupil" cx="30" cy="30" r="9" fill="#1C1917" />
        </>
    ),

    /* happy: upward arc (^) */
    happy: (
        <path
            d="M8 36 Q30 8 52 36"
            fill="none"
            stroke="#FDFBF4"
            strokeWidth="6"
            strokeLinecap="round"
        />
    ),

    /* curious-big: large open circle */
    'curious-big': (
        <>
            <circle cx="30" cy="30" r="24" fill="#FDFBF4" />
            <circle className="eye-pupil" cx="30" cy="30" r="11" fill="#1C1917" />
        </>
    ),

    /* curious-small: small circle (asymmetric pair partner) */
    'curious-small': (
        <>
            <circle cx="30" cy="32" r="14" fill="#FDFBF4" />
            <circle className="eye-pupil" cx="30" cy="32" r="6" fill="#1C1917" />
        </>
    ),

    /* sleepy: half-closed ellipse */
    sleepy: (
        <ellipse cx="30" cy="34" rx="22" ry="10" fill="#FDFBF4" />
    ),

    /* listening: circle with swirl inside */
    listening: (
        <>
            <circle cx="30" cy="30" r="22" fill="#FDFBF4" />
            <path
                d="M24 30 Q30 18 36 30 Q30 42 24 30"
                fill="none"
                stroke="#1C1917"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </>
    ),

    /* confused-raised: circle with raised inner brow line */
    'confused-raised': (
        <>
            <circle cx="30" cy="30" r="20" fill="#FDFBF4" />
            <circle className="eye-pupil" cx="30" cy="30" r="8" fill="#1C1917" />
            <line x1="20" y1="10" x2="36" y2="14" stroke="#FDFBF4" strokeWidth="3" strokeLinecap="round" />
        </>
    ),

    /* confused-squint: small squinting eye */
    'confused-squint': (
        <ellipse cx="30" cy="32" rx="18" ry="8" fill="#FDFBF4" />
    ),

    /* loved: heart shape */
    loved: (
        <path
            d="M30 46 C18 36 6 26 6 18 C6 10 14 6 22 10 Q30 16 30 16 Q30 16 38 10 C46 6 54 10 54 18 C54 26 42 36 30 46Z"
            fill="#FF85A1"
        />
    ),

    /* surprised: very large circle, fully open */
    surprised: (
        <>
            <circle cx="30" cy="30" r="26" fill="#FDFBF4" />
            <circle className="eye-pupil" cx="30" cy="30" r="10" fill="#1C1917" />
        </>
    ),

    /* booting: horizontal line (off state) */
    booting: (
        <line x1="10" y1="30" x2="50" y2="30" stroke="#FDFBF4" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    ),
};

export default function EyeExpression({ shape = 'idle', pupilOffset = { x: 0, y: 0 }, isBlinking = false, brightness = 1 }) {
    return (
        <motion.svg
            viewBox="0 0 60 60"
            className="w-full h-full"
            style={{ opacity: brightness }}
            aria-hidden="true"
        >
            {/* Blink overlay — a closing eyelid that scales vertically */}
            <motion.g
                animate={{
                    scaleY: isBlinking ? 0.08 : 1,
                }}
                transition={{ duration: BLINK_DURATION }}
                style={{ transformOrigin: '30px 30px' }}
            >
                {/* Pupil offset group — moves the pupil shapes */}
                <motion.g
                    animate={{ x: pupilOffset.x, y: pupilOffset.y }}
                    transition={{ type: 'spring', ...SPRING_CONFIG }}
                >
                    {EYE_SHAPES[shape] || EYE_SHAPES.idle}
                </motion.g>
            </motion.g>
        </motion.svg>
    );
}
