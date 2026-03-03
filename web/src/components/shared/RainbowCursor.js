/**
 * RainbowCursor — RGB glowing thin flowy animated string mouse trail.
 * Creates a smooth, colorful trail that follows the mouse cursor with customizable properties.
 * Based on Framer component with Next.js adaptations.
 */
'use client';

import { useRef, useEffect, useState, startTransition } from 'react';

export default function RainbowCursor({
    color = '#00FFFF',
    trailLength = 24,
    thickness = 3,
    glow = 16,
    speed = 0.22,
    opacity = 0.7,
    colorMode = 'rgb',
}) {
    const [points, setPoints] = useState([]);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [now, setNow] = useState(0);
    const rafRef = useRef(null);
    const containerRef = useRef(null);

    // Mouse move handler
    useEffect(() => {
        function handleMove(e) {
            const x = e.clientX;
            const y = e.clientY;
            startTransition(() => setMouse({ x, y }));
        }
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // Animate trail
    useEffect(() => {
        let running = true;

        function animate() {
            setNow(Date.now() / 1000);
            setPoints((prev) => {
                const next = prev.length
                    ? [...prev]
                    : Array(trailLength).fill({ x: mouse.x, y: mouse.y });

                // Move each point towards the previous one
                for (let i = next.length - 1; i > 0; i--) {
                    next[i] = {
                        x: next[i].x + (next[i - 1].x - next[i].x) * speed,
                        y: next[i].y + (next[i - 1].y - next[i].y) * speed,
                    };
                }

                // Head follows mouse
                next[0] = { x: mouse.x, y: mouse.y };
                return next;
            });

            if (running) rafRef.current = requestAnimationFrame(animate);
        }

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            running = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [mouse.x, mouse.y, trailLength, speed]);

    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Generate SVG path using Catmull-Rom to Bezier
    function getPath(pts) {
        if (!pts.length) return '';

        let d = `M${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i - 1] || pts[i];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2] || p2;

            const c1x = p1.x + (p2.x - p0.x) / 6;
            const c1y = p1.y + (p2.y - p0.y) / 6;
            const c2x = p2.x - (p3.x - p1.x) / 6;
            const c2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
        }
        return d;
    }

    // RGB animated gradient
    const gradientId = 'trail-gradient';
    const rgb = [
        `hsl(${(now * 120) % 360},100%,60%)`,
        `hsl(${((now * 120) + 120) % 360},100%,60%)`,
        `hsl(${((now * 120) + 240) % 360},100%,60%)`,
    ];

    const centerGlow =
        colorMode === 'solid'
            ? `drop-shadow(0 0 ${glow * 2}px ${color}) blur(${glow / 2}px) drop-shadow(0 0 24px ${color})`
            : `drop-shadow(0 0 ${glow}px ${color})`;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                background: 'transparent',
                overflow: 'visible',
            }}
        >
            <svg
                width="100vw"
                height="100vh"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                }}
            >
                <defs>
                    {colorMode === 'rgb' ? (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={rgb[0]} />
                            <stop offset="50%" stopColor={rgb[1]} />
                            <stop offset="100%" stopColor={rgb[2]} />
                        </linearGradient>
                    ) : (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} />
                        </linearGradient>
                    )}
                </defs>
                <path
                    d={getPath(points)}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    fill="none"
                    opacity={opacity}
                    filter={centerGlow}
                />
            </svg>
        </div>
    );
}
