/**
 * Dynamic OG Image Generator — Root level
 * Generates a 1200×630 branded OG image for the homepage.
 * Uses Next.js ImageResponse from next/og.
 */
import { ImageResponse } from 'next/og';

export const alt = 'Pico — AI Desktop Companion by Vaelix';
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
                {/* Decorative gradient orb */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139, 156, 244, 0.2) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '-80px',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 203, 71, 0.15) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Pico Face */}
                <div
                    style={{
                        width: '160px',
                        height: '120px',
                        borderRadius: '24px',
                        backgroundColor: '#2D2A26',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        marginBottom: '32px',
                    }}
                >
                    {/* Left eye */}
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#2D2A26',
                                display: 'flex',
                            }}
                        />
                    </div>
                    {/* Right eye */}
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#2D2A26',
                                display: 'flex',
                            }}
                        />
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: '64px',
                        fontWeight: 700,
                        color: '#2D2A26',
                        display: 'flex',
                        alignItems: 'baseline',
                    }}
                >
                    Meet Pico
                    <span style={{ color: '#8B9CF4' }}>.</span>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: '24px',
                        color: '#78716C',
                        marginTop: '12px',
                        display: 'flex',
                    }}
                >
                    Your AI companion that sees, hears, and feels.
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
                    A product by Vaelix
                </div>
            </div>
        ),
        { ...size }
    );
}
