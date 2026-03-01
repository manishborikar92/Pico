/**
 * Shared Framer Motion animation variants used across the site.
 * All durations and values are named constants — no magic numbers.
 */

/* ─── Named Duration Constants (seconds) ─── */
export const DURATION_ENTRANCE = 0.5;
export const DURATION_CARD = 0.4;
export const DURATION_PAGE = 0.25;
export const DURATION_HOVER = 0.2;
export const STAGGER_DELAY = 0.08;

/* ─── Scroll Entrance: Default ─── */
export const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: DURATION_ENTRANCE, ease: 'easeOut' } },
};

/* ─── Scroll Entrance: Card ─── */
export const cardEntrance = {
    initial: { opacity: 0, y: 16, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION_CARD, ease: 'easeOut' } },
};

/* ─── Stagger Container ─── */
export const staggerContainer = {
    animate: {
        transition: { staggerChildren: STAGGER_DELAY },
    },
};

/* ─── Page Transition ─── */
export const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATION_PAGE, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: DURATION_PAGE, ease: 'easeIn' } },
};

/* ─── Hover Presets ─── */
export const hoverScale = {
    whileHover: { scale: 1.02, transition: { duration: DURATION_HOVER } },
    whileTap: { scale: 0.98 },
};

export const hoverElevate = {
    whileHover: { y: -2, transition: { duration: DURATION_HOVER } },
};
