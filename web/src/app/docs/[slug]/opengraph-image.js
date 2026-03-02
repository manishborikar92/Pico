/**
 * OG Image — Individual doc pages (/docs/[slug])
 * Thin wrapper — uses 'doc' variant with dynamic title/category.
 */
import { generateOGImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { getDocBySlug, getAllDocSlugs } from '@/lib/docs';

export const alt = 'Pico Documentation';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
    return getAllDocSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);

    return generateOGImage({
        title: doc?.title ?? 'Documentation',
        subtitle: doc?.description ?? '',
        category: doc?.category ?? 'Docs',
        variant: 'doc',
    });
}
