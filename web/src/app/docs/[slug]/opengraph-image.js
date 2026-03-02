/**
 * Dynamic OG Image — Individual doc pages (/docs/[slug])
 * Renders a unique OG image per doc page using the slug to look up
 * the title, description, and category from docs data.
 */
import { ImageResponse } from 'next/og';
import { getDocBySlug, getAllDocSlugs } from '@/lib/docs';

export const alt = 'Pico Documentation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
    return getAllDocSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);
    const title = doc?.title ?? 'Documentation';
    const description = doc?.description ?? '';
    const category = doc?.category ?? 'Docs';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '60px 80px',
                    background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE7DB 50%, #E8E0D0 100%)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                {/* Decorative orbs */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-80px',
                        right: '-60px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139, 156, 244, 0.15) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '200px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 203, 71, 0.12) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Top bar: Pico face + branding */}
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    {/* Mini Pico face */}
                    <div
                        style={{
                            width: '44px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#2D2A26',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                        }}
                    >
                        <div
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                            }}
                        />
                        <div
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#2D2A26',
                            display: 'flex',
                        }}
                    >
                        Pico Docs
                    </div>
                </div>

                {/* Category badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(139, 156, 244, 0.12)',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        marginBottom: '20px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#8B9CF4',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            display: 'flex',
                        }}
                    >
                        {category}
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: '52px',
                        fontWeight: 700,
                        color: '#2D2A26',
                        lineHeight: 1.15,
                        maxWidth: '900px',
                        display: 'flex',
                    }}
                >
                    {title}
                </div>

                {/* Description */}
                {description && (
                    <div
                        style={{
                            fontSize: '22px',
                            color: '#78716C',
                            marginTop: '16px',
                            maxWidth: '800px',
                            display: 'flex',
                        }}
                    >
                        {description}
                    </div>
                )}

                {/* Vaelix badge */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '32px',
                        right: '40px',
                        fontSize: '16px',
                        color: '#A8A29E',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    Pico — by Vaelix
                </div>
            </div>
        ),
        { ...size }
    );
}
