/**
 * Dynamic OG Image — Docs index page
 * Generates a branded 1200×630 OG image for /docs.
 */
import { ImageResponse } from 'next/og';

export const alt = 'Documentation — Pico by Vaelix';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(78, 205, 196, 0.18) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-60px',
                        left: '-40px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139, 156, 244, 0.15) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Category badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(78, 205, 196, 0.12)',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        marginBottom: '24px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#4ECDC4',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            display: 'flex',
                        }}
                    >
                        Documentation
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: '56px',
                        fontWeight: 700,
                        color: '#2D2A26',
                        display: 'flex',
                    }}
                >
                    Discover PICO
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: '22px',
                        color: '#78716C',
                        marginTop: '16px',
                        maxWidth: '700px',
                        textAlign: 'center',
                        display: 'flex',
                    }}
                >
                    Learn about the technology, features, and vision behind Pico.
                </div>

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
