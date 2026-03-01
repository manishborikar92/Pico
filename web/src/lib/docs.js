/**
 * Documentation page data — Maps URL slugs to document metadata.
 * Used by the dynamic docs route and the sidebar navigation.
 */

export const DOCS_NAV = [
    {
        category: 'Getting Started',
        items: [
            { slug: 'overview', title: 'Project Overview', description: 'What is PICO and why does it exist?' },
            { slug: 'features', title: 'Features', description: 'Complete feature list and capabilities' },
            { slug: 'hardware', title: 'Hardware Guide', description: 'Components, BOM, and wiring' },
        ],
    },
    {
        category: 'Development',
        items: [
            { slug: 'development-plan', title: 'Development Plan', description: 'Phased development roadmap' },
            { slug: 'technology-stack', title: 'Technology Stack', description: 'Software and cloud services' },
            { slug: 'sound-bank', title: 'Sound Bank Guide', description: 'Creating PICO\'s voice' },
        ],
    },
    {
        category: 'Environment',
        items: [
            { slug: 'windows-guide', title: 'Windows Setup', description: 'Development on Windows 11' },
            { slug: 'faq', title: 'FAQ', description: 'Frequently asked questions' },
            { slug: 'project-structure', title: 'Project Structure', description: 'File organization guide' },
        ],
    },
];

/**
 * Returns a flat array of all doc items for easy lookup.
 */
export function getAllDocSlugs() {
    return DOCS_NAV.flatMap((cat) => cat.items.map((item) => item.slug));
}

/**
 * Find a doc item by slug.
 */
export function getDocBySlug(slug) {
    for (const cat of DOCS_NAV) {
        const item = cat.items.find((i) => i.slug === slug);
        if (item) return { ...item, category: cat.category };
    }
    return null;
}
