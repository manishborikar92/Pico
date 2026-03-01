/**
 * PicoFace — The animated robot face component.
 * Renders a dark rounded rectangle with two EyeExpression sub-components.
 * Supports expressions, boot-up sequence, idle behaviors, and mouse tracking.
 *
 * @param {'idle'|'happy'|'curious'|'sleepy'|'listening'|'confused'|'loved'|'surprised'|'booting'} expression
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {boolean} interactive  — enables mouse-tracking
 * @param {boolean} autoAnimate  — enables random idle behaviors
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import EyeExpression from './EyeExpression';

/* ─── Size Presets (px) ─── */
const SIZE_MAP = {
    sm: { w: 80, h: 48, gap: 8, radius: 12 },
    md: { w: 160, h: 96, gap: 16, radius: 16 },
    lg: { w: 280, h: 168, gap: 24, radius: 20 },
    xl: { w: 400, h: 240, gap: 32, radius: 24 },
};

/* ─── Animation Timing Constants (ms) ─── */
const BOOT_LEFT_START = 300;
const BOOT_RIGHT_START = 500;
const BOOT_SCAN_DURATION = 200;
const BOOT_BLINK_AT = 800;
const BOOT_BLINK_CLOSE = 50;
const BOOT_BLINK_OPEN = 80;
const BOOT_IDLE_START = 1000;

const BLINK_MIN_INTERVAL = 3000;
const BLINK_MAX_INTERVAL = 6000;
const BLINK_CLOSE_DURATION = 80;

const LOOK_MIN_INTERVAL = 15000;
const LOOK_MAX_INTERVAL = 30000;
const LOOK_OFFSET = -8;
const LOOK_MOVE_DURATION = 200;
const LOOK_HOLD_DURATION = 300;

const SLEEPY_MIN_INTERVAL = 45000;
const SLEEPY_MAX_INTERVAL = 90000;
const SLEEPY_DURATION = 1000;

const MAX_PUPIL_DISPLACEMENT = 8;
const EXPRESSION_HALF_BLINK_MS = 100;

/* ─── Expression → Eye Shape Mapping ─── */
function getEyeShapes(expression) {
    switch (expression) {
        case 'happy':
            return { left: 'happy', right: 'happy' };
        case 'curious':
            return { left: 'curious-big', right: 'curious-small' };
        case 'sleepy':
            return { left: 'sleepy', right: 'sleepy' };
        case 'listening':
            return { left: 'listening', right: 'listening' };
        case 'confused':
            return { left: 'confused-raised', right: 'confused-squint' };
        case 'loved':
            return { left: 'loved', right: 'loved' };
        case 'surprised':
            return { left: 'surprised', right: 'surprised' };
        case 'booting':
            return { left: 'booting', right: 'booting' };
        case 'idle':
        default:
            return { left: 'idle', right: 'idle' };
    }
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PicoFace({
    expression: externalExpression = 'idle',
    size = 'md',
    interactive = false,
    autoAnimate = false,
}) {
    const dims = SIZE_MAP[size] || SIZE_MAP.md;

    /* ─── Internal State ─── */
    const [currentExpression, setCurrentExpression] = useState('idle');
    const [isBlinking, setIsBlinking] = useState(false);
    const [leftBrightness, setLeftBrightness] = useState(1);
    const [rightBrightness, setRightBrightness] = useState(1);
    const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasBooted, setHasBooted] = useState(true);

    const faceRef = useRef(null);
    const timersRef = useRef([]);

    /* ─── Helper to clear all timers on unmount ─── */
    const addTimer = useCallback((id) => {
        timersRef.current.push(id);
    }, []);

    /* ─── Boot-up Animation Sequence ─── */
    useEffect(() => {
        /* Step 1: Both eyes start as booting (dim lines) */
        setCurrentExpression('booting');
        setLeftBrightness(0.3);
        setRightBrightness(0.3);
        setHasBooted(false);
        setIsBlinking(false); // ensure clean start

        /* Step 2: Left eye scans on */
        const t1 = setTimeout(() => {
            setLeftBrightness(1);
        }, BOOT_LEFT_START);
        addTimer(t1);

        /* Step 3: Right eye scans on */
        const t2 = setTimeout(() => {
            setRightBrightness(1);
        }, BOOT_RIGHT_START);
        addTimer(t2);

        /* Step 4a: Blink close (flat timeout — not nested) */
        const t3 = setTimeout(() => {
            setIsBlinking(true);
        }, BOOT_BLINK_AT);
        addTimer(t3);

        /* Step 4b: Blink open (flat timeout) */
        const t3b = setTimeout(() => {
            setIsBlinking(false);
        }, BOOT_BLINK_AT + BOOT_BLINK_OPEN);
        addTimer(t3b);

        /* Step 5: Transition to idle (or external expression) */
        const t4 = setTimeout(() => {
            setCurrentExpression(externalExpression === 'booting' ? 'idle' : externalExpression);
            setHasBooted(true);
        }, BOOT_IDLE_START);
        addTimer(t4);

        return () => {
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ─── Sync external expression changes (with half-blink transition) ─── */
    const prevExpressionRef = useRef(externalExpression);
    useEffect(() => {
        if (!hasBooted) return;
        if (externalExpression === prevExpressionRef.current) return;

        prevExpressionRef.current = externalExpression;

        setIsTransitioning(true);
        setIsBlinking(true);

        const t1 = setTimeout(() => {
            setCurrentExpression(externalExpression);
        }, EXPRESSION_HALF_BLINK_MS);

        const t2 = setTimeout(() => {
            setIsBlinking(false);
            setIsTransitioning(false);
        }, EXPRESSION_HALF_BLINK_MS * 2);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [externalExpression, hasBooted]);

    /* ─── Idle Behaviors ─── */
    useEffect(() => {
        if (!autoAnimate || !hasBooted) return;

        const intervals = [];

        /* Random blinking */
        function scheduleBlink() {
            const delay = randomBetween(BLINK_MIN_INTERVAL, BLINK_MAX_INTERVAL);
            const id = setTimeout(() => {
                if (!isTransitioning) {
                    setIsBlinking(true);
                    const closeId = setTimeout(() => setIsBlinking(false), BLINK_CLOSE_DURATION);
                    addTimer(closeId);
                }
                scheduleBlink();
            }, delay);
            addTimer(id);
            intervals.push(id);
        }
        scheduleBlink();

        /* Random look left/right */
        function scheduleLook() {
            const delay = randomBetween(LOOK_MIN_INTERVAL, LOOK_MAX_INTERVAL);
            const id = setTimeout(() => {
                if (!interactive) {
                    setPupilOffset({ x: LOOK_OFFSET, y: 0 });
                    const holdId = setTimeout(() => {
                        setPupilOffset({ x: -LOOK_OFFSET, y: 0 });
                        const returnId = setTimeout(() => {
                            setPupilOffset({ x: 0, y: 0 });
                        }, LOOK_HOLD_DURATION);
                        addTimer(returnId);
                    }, LOOK_MOVE_DURATION + LOOK_HOLD_DURATION);
                    addTimer(holdId);
                }
                scheduleLook();
            }, delay);
            addTimer(id);
            intervals.push(id);
        }
        scheduleLook();

        /* Rare sleepy drift */
        function scheduleSleepy() {
            const delay = randomBetween(SLEEPY_MIN_INTERVAL, SLEEPY_MAX_INTERVAL);
            const id = setTimeout(() => {
                if (currentExpression === 'idle' && !isTransitioning) {
                    setCurrentExpression('sleepy');
                    const backId = setTimeout(() => {
                        setCurrentExpression('idle');
                    }, SLEEPY_DURATION);
                    addTimer(backId);
                }
                scheduleSleepy();
            }, delay);
            addTimer(id);
            intervals.push(id);
        }
        scheduleSleepy();

        return () => {
            intervals.forEach(clearTimeout);
        };
    }, [autoAnimate, hasBooted, interactive, currentExpression, isTransitioning, addTimer]);

    /* ─── Mouse Tracking ─── */
    useEffect(() => {
        if (!interactive || !hasBooted) return;

        function handleMouseMove(e) {
            const face = faceRef.current;
            if (!face) return;
            const rect = face.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            /* Clamp to max displacement */
            const maxRange = 600;
            const offsetX = Math.max(-MAX_PUPIL_DISPLACEMENT, Math.min(MAX_PUPIL_DISPLACEMENT, (dx / maxRange) * MAX_PUPIL_DISPLACEMENT));
            const offsetY = Math.max(-MAX_PUPIL_DISPLACEMENT, Math.min(MAX_PUPIL_DISPLACEMENT, (dy / maxRange) * MAX_PUPIL_DISPLACEMENT));

            setPupilOffset({ x: offsetX, y: offsetY });
        }

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [interactive, hasBooted]);

    /* ─── Cleanup all timers on unmount ─── */
    useEffect(() => {
        return () => {
            timersRef.current.forEach(clearTimeout);
        };
    }, []);

    const shapes = getEyeShapes(currentExpression);
    const expressionLabel = currentExpression || 'idle';

    return (
        <motion.div
            ref={faceRef}
            className="relative flex items-center justify-center"
            style={{
                width: dims.w,
                height: dims.h,
                borderRadius: dims.radius,
                backgroundColor: '#1C1917',
                gap: dims.gap,
                willChange: 'transform',
                padding: `${dims.gap}px`,
            }}
            aria-label={`PICO robot face showing ${expressionLabel} expression`}
            role="img"
        >
            {/* Left Eye */}
            {(() => {
                const eyeW = (dims.w - dims.gap * 3) / 2;
                const eyeH = dims.h - dims.gap * 2;
                const eyeSize = Math.min(eyeW, eyeH);
                return (
                    <div style={{ width: eyeW, height: eyeH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: eyeSize, height: eyeSize }}>
                            <EyeExpression
                                shape={shapes.left}
                                pupilOffset={pupilOffset}
                                isBlinking={isBlinking}
                                brightness={leftBrightness}
                            />
                        </div>
                    </div>
                );
            })()}

            {/* Right Eye */}
            {(() => {
                const eyeW = (dims.w - dims.gap * 3) / 2;
                const eyeH = dims.h - dims.gap * 2;
                const eyeSize = Math.min(eyeW, eyeH);
                return (
                    <div style={{ width: eyeW, height: eyeH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: eyeSize, height: eyeSize }}>
                            <EyeExpression
                                shape={shapes.right}
                                pupilOffset={pupilOffset}
                                isBlinking={isBlinking}
                                brightness={rightBrightness}
                            />
                        </div>
                    </div>
                );
            })()}
        </motion.div>
    );
}
