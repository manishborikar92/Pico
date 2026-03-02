/**
 * Dynamic Sitemap Generator — Next.js 15+ convention
 * Exports a default function that returns all site URLs.
 * Next.js automatically serves this as /sitemap.xml.
 *
 * Covers:
 *  - Homepage (/)
 *  - About (/about)
 *  - Docs index (/docs)
 *  - All individual doc pages (/docs/[slug])
 */
import { getAllDocSlugs } from '@/lib/docs';

const BASE_URL = 'https://pico.vaelix.in';

export default function sitemap() {
    const now = new Date();

    /* ─── Static pages ─── */
    const staticPages = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/docs`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    /* ─── Dynamic doc pages ─── */
    const docPages = getAllDocSlugs().map((slug) => ({
        url: `${BASE_URL}/docs/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...staticPages, ...docPages];
}
