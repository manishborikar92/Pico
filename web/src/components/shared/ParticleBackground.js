/**
 * ParticleBackground — Animated particle constellation field with neural network aesthetic.
 * Creates a dynamic background with drifting particles connected by lines when nearby.
 * Uses periwinkle and amber colors to match the Pico brand palette.
 */
'use client';

import { useEffect, useRef } from 'react';

/* ─── Particle Configuration ─── */
const PARTICLE_COUNT = 72;
const MAX_LINK_DISTANCE = 140;
const PERIWINKLE = [110, 120, 220];   // matches --periwinkle
const AMBER     = [255, 203, 71];     // matches existing glow color

export default function ParticleBackground() {
    const canvasRef = useRef(null);
    const animRef   = useRef(null);
    const particles = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        /* ── Resize handler ── */
        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        /* ── Seed particles ── */
        function seed() {
            particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
                const useAmber = Math.random() < 0.25;
                const [r, g, b] = useAmber ? AMBER : PERIWINKLE;
                return {
                    x:   Math.random() * canvas.width,
                    y:   Math.random() * canvas.height,
                    vx:  (Math.random() - 0.5) * 0.28,
                    vy:  (Math.random() - 0.5) * 0.28,
                    r,g,b,
                    radius: Math.random() * 2.2 + 1.2,
                    alpha:  Math.random() * 0.35 + 0.55,
                    pulse:  Math.random() * Math.PI * 2, // phase offset
                };
            });
        }
        seed();

        /* ── Draw loop ── */
        function draw(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const pts = particles.current;

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];

                // Drift
                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < -10)                p.x = canvas.width  + 10;
                if (p.x > canvas.width  + 10) p.x = -10;
                if (p.y < -10)                p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                // Pulse alpha gently
                const pulse = p.alpha * (0.7 + 0.3 * Math.sin(time * 0.001 + p.pulse));

                // Draw node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${pulse})`;
                ctx.fill();

                // Draw links to nearby particles
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < MAX_LINK_DISTANCE) {
                        const linkAlpha = (1 - dist / MAX_LINK_DISTANCE) * 0.38;
                        // Blend colors of the two endpoints
                        const mr = (p.r + q.r) >> 1;
                        const mg = (p.g + q.g) >> 1;
                        const mb = (p.b + q.b) >> 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${mr},${mg},${mb},${linkAlpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw);
        }

        animRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 1 }}
        />
    );
}
