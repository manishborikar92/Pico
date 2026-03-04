/**
 * Documentation page data — Maps URL slugs to document metadata.
 * Used by the dynamic docs route and the sidebar navigation.
 * 
 * Only product-relevant documentation is publicly exposed.
 * Development/build guides are internal to Vaelix.
 */

export const DOCS_NAV = [
    {
        category: 'About Pico',
        items: [
            { slug: 'overview', title: 'Project Overview', description: 'What is PICO and the vision behind it' },
            { slug: 'features', title: 'Features', description: 'Complete feature list and capabilities' },
        ],
    },
    {
        category: 'Technical Details',
        items: [
            { slug: 'picoface-system', title: 'PicoFace System', description: 'Face animation system, emotional states, and component API' },
            { slug: 'hardware', title: 'Hardware', description: 'The hardware platform powering Pico' },
            { slug: 'technology-stack', title: 'Technology Stack', description: 'Software and AI services under the hood' },
            { slug: 'sound-bank', title: 'Sound Design', description: 'How Pico communicates through sound' },
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
