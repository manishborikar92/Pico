'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

/* ─── Context ─── */
const LenisContext = createContext({ current: null });

/**
 * Returns the stable ref object — never null on first render.
 * Usage: const lenis = useLenis(); lenis.current?.scrollTo('#section');
 */
export function useLenis() {
    return useContext(LenisContext);
}

/* ─── Constants (outside component — never recreated) ─── */
const LENIS_DURATION         = 1.2;
const LENIS_WHEEL_MULTIPLIER = 1.0;

// ✅ Hoisted outside — same reference on every call, no GC pressure
const easeExpo = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/* ─── Provider ─── */
export default function LenisProvider({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        function destroyLenis() {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        }

        function initLenis() {
            destroyLenis();
            if (mediaQuery.matches) return;

            // ✅ autoRaf: true — Lenis manages its own RAF loop internally
            // No manual requestAnimationFrame needed, no rafId ref needed
            lenisRef.current = new Lenis({
                duration:        LENIS_DURATION,
                easing:          easeExpo,          // ✅ Stable reference, not recreated
                smoothWheel:     true,
                smoothTouch:     false,             // ✅ Explicit — native scroll on mobile
                wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
                autoRaf:         true,              // ✅ Lenis owns the loop — cleaner
            });
        }

        mediaQuery.addEventListener('change', initLenis);
        initLenis();

        return () => {
            mediaQuery.removeEventListener('change', initLenis);
            destroyLenis();
        };
    }, []);

    // ✅ Ref object (stable) as context value — no null flash for consumers
    return (
        <LenisContext.Provider value={lenisRef}>
            {children}
        </LenisContext.Provider>
    );
}
