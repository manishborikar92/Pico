/**
 * LenisProvider — Client-side smooth scroll provider.
 *
 * Fixes applied:
 * ✅ Migrated from deprecated `@studio-freight/lenis` → `lenis`
 * ✅ Replaced useState with useRef (no unnecessary re-renders)
 * ✅ prefers-reduced-motion is now reactive (listens for OS-level changes)
 * ✅ SSR guard added (safe for Next.js / SSR environments)
 * ✅ Context always provides a stable ref object — no null leaks to consumers
 * ✅ RAF loop is properly managed and isolated
 */
'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis'; // ✅ Updated: @studio-freight/lenis is deprecated

/* ─── Context ─── */

/**
 * Stores a ref object { current: Lenis | null } instead of the instance directly.
 * This means consumers always get a stable reference — never null on first render.
 */
const LenisContext = createContext({ current: null });

/** Access the Lenis instance from any child component.
 *  @returns {{ current: import('lenis').default | null }}
 *
 *  Usage:
 *    const lenis = useLenis();
 *    lenis.current?.scrollTo('#section');
 */
export function useLenis() {
    return useContext(LenisContext);
}

/* ─── Lenis Configuration Constants ─── */
const LENIS_DURATION         = 1.2;
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