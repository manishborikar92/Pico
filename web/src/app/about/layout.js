/**
 * About page layout — provides enhanced metadata for SEO & social sharing
 */
export const metadata = {
    title: 'About',
    description: 'Learn about the origin, philosophy, and vision behind Pico — an AI desktop companion by Vaelix.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About — Pico by Vaelix',
        description: 'The origin, design philosophy, and vision behind the AI desktop companion.',
        url: '/about',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About — Pico by Vaelix',
        description: 'The origin, design philosophy, and vision behind the AI desktop companion.',
    },
};

export default function AboutLayout({ children }) {
    return children;
}
