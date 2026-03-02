/**
 * OG Image — Homepage
 * Thin wrapper around the shared OG generator.
 */
import { generateOGImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Pico — AI Desktop Companion by Vaelix';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return generateOGImage({
        title: 'Meet Pico',
        subtitle: 'Your AI companion that sees, hears, and feels.',
        variant: 'hero',
    });
}
