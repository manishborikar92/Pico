/**
 * OG Image — Docs index page
 * Thin wrapper — uses 'page' variant with Pico face + badge.
 */
import { generateOGImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Documentation — Pico by Vaelix';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return generateOGImage({
        title: 'Discover PICO',
        subtitle: 'Learn about the technology, features, and vision behind Pico.',
        badge: 'Documentation',
        badgeColor: '#4ECDC4',
    });
}
