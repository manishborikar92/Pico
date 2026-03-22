'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext({ current: null });

export function useLenis() {
    return useContext(LenisContext).current; // ← cleaner for consumers
}

const LENIS_DURATION         = 1.2;
const LENIS_WHEEL_MULTIPLIER = 1.0;

export default function LenisProvider({ children }) {
    const lenisRef = useRef(null);
    const rafId    = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        function initLenis() {
            destroyLenis();
            if (mediaQuery.matches) return;

            const lenis = new Lenis({
                duration:        LENIS_DURATION,
                easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel:     true,
                smoothTouch:     false,     // ✅ Explicit — no JS scroll on mobile
                wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
                // touchMultiplier removed — it's inert when smoothTouch is false
            });

            lenisRef.current = lenis;

            function raf(time) {
                lenis.raf(time);
                rafId.current = requestAnimationFrame(raf);
            }
            rafId.current = requestAnimationFrame(raf);
        }

        function destroyLenis() {
            if (rafId.current)    { cancelAnimationFrame(rafId.current); rafId.current = null; }
            if (lenisRef.current) { lenisRef.current.destroy(); lenisRef.current = null; }
        }

        mediaQuery.addEventListener('change', initLenis);
        initLenis();

        return () => {
            mediaQuery.removeEventListener('change', initLenis);
            destroyLenis();
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisRef}>
            {children}
        </LenisContext.Provider>
    );
}
The core architecture is sound — these are refinements, not rewrites.const LENIS_DURATION         = 1.2;
const LENIS_WHEEL_MULTIPLIER = 1.0;
const LENIS_TOUCH_MULTIPLIER = 2.0;

/* ─── Provider ─── */

export default function LenisProvider({ children }) {
    // Use a ref for the Lenis instance — it's mutable state, not UI state.
    // Storing it in useState would cause all consumers to re-render on init.
    const lenisRef = useRef(null);
    const rafId    = useRef(null);

    useEffect(() => {
        // ✅ SSR guard — window is not available in server environments
        if (typeof window === 'undefined') return;

        // ✅ Reactive prefers-reduced-motion: listen for changes at the OS level
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        function initLenis() {
            // Tear down any existing instance before re-initialising
            destroyLenis();

            if (mediaQuery.matches) return; // User prefers reduced motion — skip

            const lenis = new Lenis({
                duration:         LENIS_DURATION,
                easing:           (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel:      true,
                wheelMultiplier:  LENIS_WHEEL_MULTIPLIER,
                touchMultiplier:  LENIS_TOUCH_MULTIPLIER,
            });

            lenisRef.current = lenis;

            // ✅ Isolated RAF loop — only one loop, no duplication
            function raf(time) {
                lenis.raf(time);
                rafId.current = requestAnimationFrame(raf);
            }

            rafId.current = requestAnimationFrame(raf);
        }

        function destroyLenis() {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        }

        // ✅ Re-initialise whenever the user toggles reduced-motion in OS settings
        function handleMotionChange() {
            initLenis();
        }

        mediaQuery.addEventListener('change', handleMotionChange);
        initLenis(); // Initial setup

        return () => {
            mediaQuery.removeEventListener('change', handleMotionChange);
            destroyLenis();
        };
    }, []);

    // ✅ Pass the ref object itself (stable across renders) — no null flash for consumers
    return (
        <LenisContext.Provider value={lenisRef}>
            {children}
        </LenisContext.Provider>
    );
}
