/**
 * LenisProvider — Client-side smooth scroll provider.
 * Initializes Lenis smooth scroll and connects it to the requestAnimationFrame loop.
 * Exposes the Lenis instance via React context so child components can access it.
 */
'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisContext = createContext(null);

/** Access the Lenis instance from any child component */
export function useLenis() {
    return useContext(LenisContext);
}

/* ─── Lenis Configuration Constants ─── */
const LENIS_DURATION = 1.2;
const LENIS_WHEEL_MULTIPLIER = 1.0;
const LENIS_TOUCH_MULTIPLIER = 2.0;

export default function LenisProvider({ children }) {
    const [lenisInstance, setLenisInstance] = useState(null);
    const rafId = useRef(null);

    useEffect(() => {
        /* Respect prefers-reduced-motion */
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const lenis = new Lenis({
            duration: LENIS_DURATION,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
            touchMultiplier: LENIS_TOUCH_MULTIPLIER,
        });

        setLenisInstance(lenis);

        function raf(time) {
            lenis.raf(time);
            rafId.current = requestAnimationFrame(raf);
        }

        rafId.current = requestAnimationFrame(raf);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            lenis.destroy();
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisInstance}>
            {children}
        </LenisContext.Provider>
    );
}
