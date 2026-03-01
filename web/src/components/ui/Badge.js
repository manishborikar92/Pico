/**
 * Badge — Small label component.
 * Variants: default (filled), outline, rainbow (gradient border).
 *
 * @param {'default'|'outline'|'rainbow'} variant
 * @param {React.ReactNode} children
 */
import { cn } from '@/lib/utils';

const VARIANT_CLASSES = {
    default: 'bg-warm-gray-light text-ink border border-warm-gray-mid',
    outline: 'bg-transparent text-ink border border-warm-gray-mid',
    rainbow: 'rainbow-border text-ink',
};

export default function Badge({ variant = 'default', children, className, ...props }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-pill text-caption font-medium',
                VARIANT_CLASSES[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
