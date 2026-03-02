/**
 * OG Image — About page
 * Thin wrapper — uses 'page' variant with Pico face + badge.
 */
import { generateOGImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'About Pico — AI Desktop Companion by Vaelix';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return generateOGImage({
        title: 'The Story Behind Pico',
        subtitle: 'Origin, design philosophy, and vision of the AI desktop companion.',
        badge: 'About',
    });
}
