/**
 * cn() — Utility for merging Tailwind CSS classes.
 * Combines clsx for conditional classes with tailwind-merge
 * to intelligently resolve conflicting Tailwind utilities.
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
