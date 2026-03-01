/**
 * RainbowBadge — Pill badge with rainbow shimmer gradient border.
 * Used for feature IDs like AI-1, V-3, etc.
 * Interior background is cream white; text is ink color.
 *
 * @param {React.ReactNode} children – Badge text content
 */
import { cn } from '@/lib/utils';

export default function RainbowBadge({ children, className }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-pill font-mono text-caption font-medium',
                'rainbow-border text-ink',
                className
            )}
        >
            {children}
        </span>
    );
}
