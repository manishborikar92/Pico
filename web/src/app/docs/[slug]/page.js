/**
 * Dynamic doc page — Reads markdown files from the project docs/ directory
 * and renders them with styled markdown formatting.
 * Route: /docs/[slug]
 */
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { getDocBySlug, getAllDocSlugs } from '@/lib/docs';
import DocContent from '@/components/docs/DocContent';

/* ─── Slug → File Mapping ─── */
const SLUG_TO_FILE = {
    'overview': 'Project_Description.md',
    'features': 'Features.md',
    'hardware': 'Hardware.md',
    'development-plan': 'Development_Plan.md',
    'technology-stack': 'Technology_Stack.md',
    'sound-bank': 'Sound_Bank_Guide.md',
    'windows-guide': 'Windows_Development_Guide.md',
    'faq': 'FAQ_Development_Environment.md',
    'project-structure': 'Project_Structure.md',
};

/**
 * Generate static params for all doc slugs at build time.
 */
export async function generateStaticParams() {
    return getAllDocSlugs().map((slug) => ({ slug }));
}

/**
 * Generate comprehensive metadata per doc page for SEO & social sharing.
 */
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);
    if (!doc) return {};

    const title = doc.title;
    const description = doc.description;

    return {
        title,
        description,
        alternates: {
            canonical: `/docs/${slug}`,
        },
        openGraph: {
            title: `${title} — Pico Docs`,
            description,
            url: `/docs/${slug}`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} — Pico Docs`,
            description,
        },
    };
}

/**
 * Read the markdown file content for a given slug.
 */
function getDocContent(slug) {
    const filename = SLUG_TO_FILE[slug];
    if (!filename) return null;

    /* Look for docs in the project root's docs/ directory */
    const docsDir = path.join(process.cwd(), '..', 'docs');
    const filePath = path.join(docsDir, filename);

    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch {
        return null;
    }
}

export default async function DocPage({ params }) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);
    if (!doc) notFound();

    const content = getDocContent(slug);
    if (!content) notFound();

    return (
        <article>
            {/* Page Header */}
            <div className="mb-8 pb-6 border-b border-warm-gray-mid">
                <span className="text-caption text-periwinkle font-medium uppercase tracking-wider">
                    {doc.category}
                </span>
                <h1 className="text-display-md text-ink mt-2">{doc.title}</h1>
                <p className="text-body-lg text-ink-light mt-2">{doc.description}</p>
            </div>

            {/* Rendered markdown content */}
            <DocContent content={content} />
        </article>
    );
}
