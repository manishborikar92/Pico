/**
 * Dynamic Robots.txt Generator — Next.js 15+ convention
 * Next.js automatically serves this as /robots.txt.
 */
const BASE_URL = 'https://pico.vaelix.in';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
