/**
 * AnimatedCounter — A number that counts up from 0 to a target value
 * when it enters the viewport. Uses Framer Motion's useInView to trigger.
 *
 * @param {number} value    – Target number to count to
 * @param {string} [suffix] – e.g. "MHz", "%", "hrs"
 * @param {number} [duration] – Animation duration in seconds (default 1.5)
 */
'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const DEFAULT_DURATION = 1.5;

export default function AnimatedCounter({ value, suffix = '', duration = DEFAULT_DURATION }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime = null;
        let animationFrameId;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            /* Ease-out cubic */
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(easedProgress * value));

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isInView, value, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {displayValue}
            {suffix}
        </span>
    );
}
