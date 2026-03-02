/**
 * Shared OG Image Generator — Single source of truth
 * 
 * All page-level opengraph-image.js files call this utility.
 * This ensures consistent branding and eliminates code duplication.
 *
 * Usage:
 *   import { generateOGImage } from '@/lib/og';
 *   export default function Image() {
 *       return generateOGImage({ title: 'My Page' });
 *   }
 */
import { ImageResponse } from 'next/og';

/* ─── Shared Constants ─── */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/* ─── Design Tokens ─── */
const COLORS = {
    bg: '#F5F0E8',
    bgMid: '#EDE7DB',
    bgEnd: '#E8E0D0',
    ink: '#2D2A26',
    inkLight: '#78716C',
    inkMuted: '#A8A29E',
    periwinkle: '#8B9CF4',
    teal: '#4ECDC4',
    amber: 'rgba(255, 203, 71, 0.15)',
    orbBlue: 'rgba(139, 156, 244, 0.18)',
    orbTeal: 'rgba(78, 205, 196, 0.15)',
};

/* ─── Reusable Pico Face Component ─── */
function PicoFace({ size = 'lg' }) {
    const isLarge = size === 'lg';
    const w = isLarge ? 160 : 44;
    const h = isLarge ? 120 : 32;
    const r = isLarge ? 24 : 8;
    const eyeOuter = isLarge ? 44 : 10;
    const eyeInner = isLarge ? 20 : 4;
    const gap = isLarge ? 24 : 6;

    return (
        <div
            style={{
                width: `${w}px`,
                height: `${h}px`,
                borderRadius: `${r}px`,
                backgroundColor: COLORS.ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `${gap}px`,
            }}
        >
            {/* Left eye */}
            <div
                style={{
                    width: `${eyeOuter}px`,
                    height: `${eyeOuter}px`,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: `${eyeInner}px`,
                        height: `${eyeInner}px`,
                        borderRadius: '50%',
                        backgroundColor: COLORS.ink,
                        display: 'flex',
                    }}
                />
            </div>
            {/* Right eye */}
            <div
                style={{
                    width: `${eyeOuter}px`,
                    height: `${eyeOuter}px`,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: `${eyeInner}px`,
                        height: `${eyeInner}px`,
                        borderRadius: '50%',
                        backgroundColor: COLORS.ink,
                        display: 'flex',
                    }}
                />
            </div>
        </div>
    );
}

/* ─── Decorative Gradient Orbs ─── */
function BackgroundOrbs() {
    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${COLORS.orbBlue} 0%, transparent 70%)`,
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
                    background: `radial-gradient(circle, ${COLORS.amber} 0%, transparent 70%)`,
                    display: 'flex',
                }}
            />
        </>
    );
}

/* ─── Vaelix Badge (bottom-right) ─── */
function VaelixBadge({ text = 'Pico — by Vaelix' }) {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: '32px',
                right: '40px',
                fontSize: '16px',
                color: COLORS.inkMuted,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
            }}
        >
            {text}
        </div>
    );
}

/* ─── Category Badge Pill ─── */
function CategoryBadge({ label, color = COLORS.periwinkle }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: `${color}18`,
                padding: '8px 20px',
                borderRadius: '20px',
                marginBottom: '20px',
            }}
        >
            <div
                style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'flex',
                }}
            >
                {label}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
 * PUBLIC API — generateOGImage()
 *
 * Options:
 *   title       — Main heading (required)
 *   subtitle    — Secondary text below title
 *   badge       — Small uppercase pill label (e.g. "About", "Documentation")
 *   badgeColor  — Color for the badge pill (default: periwinkle)
 *   variant     — 'hero' | 'page' | 'doc' (controls layout)
 *   category    — Doc category (for variant='doc', shown in top-left)
 * ═══════════════════════════════════════════════ */
export function generateOGImage({
    title,
    subtitle,
    badge,
    badgeColor,
    variant = 'page',
    category,
} = {}) {
    /* ── Hero variant: centered Pico face + headline ── */
    if (variant === 'hero') {
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
                        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgMid} 50%, ${COLORS.bgEnd} 100%)`,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                >
                    <BackgroundOrbs />

                    <PicoFace size="lg" />

                    <div
                        style={{
                            fontSize: '64px',
                            fontWeight: 700,
                            color: COLORS.ink,
                            display: 'flex',
                            alignItems: 'baseline',
                            marginTop: '32px',
                        }}
                    >
                        {title}
                        <span style={{ color: COLORS.periwinkle }}>.</span>
                    </div>

                    {subtitle && (
                        <div
                            style={{
                                fontSize: '24px',
                                color: COLORS.inkLight,
                                marginTop: '12px',
                                display: 'flex',
                            }}
                        >
                            {subtitle}
                        </div>
                    )}

                    <VaelixBadge text="A product by Vaelix" />
                </div>
            ),
            { ...OG_SIZE }
        );
    }

    /* ── Doc variant: left-aligned with Pico branding top-left ── */
    if (variant === 'doc') {
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
                        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgMid} 50%, ${COLORS.bgEnd} 100%)`,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                >
                    <BackgroundOrbs />

                    {/* Top bar: Pico branding */}
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
                        <PicoFace size="sm" />
                        <div
                            style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: COLORS.ink,
                                display: 'flex',
                            }}
                        >
                            Pico Docs
                        </div>
                    </div>

                    {category && <CategoryBadge label={category} />}

                    <div
                        style={{
                            fontSize: '52px',
                            fontWeight: 700,
                            color: COLORS.ink,
                            lineHeight: 1.15,
                            maxWidth: '900px',
                            display: 'flex',
                        }}
                    >
                        {title}
                    </div>

                    {subtitle && (
                        <div
                            style={{
                                fontSize: '22px',
                                color: COLORS.inkLight,
                                marginTop: '16px',
                                maxWidth: '800px',
                                display: 'flex',
                            }}
                        >
                            {subtitle}
                        </div>
                    )}

                    <VaelixBadge />
                </div>
            ),
            { ...OG_SIZE }
        );
    }

    /* ── Page variant (default): centered with badge + Pico branding ── */
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
                    background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgMid} 50%, ${COLORS.bgEnd} 100%)`,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                <BackgroundOrbs />

                {/* Pico face above the badge */}
                <div style={{ marginBottom: '24px', display: 'flex' }}>
                    <PicoFace size="lg" />
                </div>

                {badge && <CategoryBadge label={badge} color={badgeColor || COLORS.periwinkle} />}

                <div
                    style={{
                        fontSize: '56px',
                        fontWeight: 700,
                        color: COLORS.ink,
                        display: 'flex',
                    }}
                >
                    {title}
                </div>

                {subtitle && (
                    <div
                        style={{
                            fontSize: '22px',
                            color: COLORS.inkLight,
                            marginTop: '16px',
                            maxWidth: '700px',
                            textAlign: 'center',
                            display: 'flex',
                        }}
                    >
                        {subtitle}
                    </div>
                )}

                <VaelixBadge />
            </div>
        ),
        { ...OG_SIZE }
    );
}
