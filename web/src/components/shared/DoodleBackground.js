/**
 * DoodleBackground — WhatsApp-style scattered doodle pattern background.
 * An SVG pattern tile containing ~18 hand-drawn-style doodles (stars, hearts,
 * leaves, speech bubbles, sparkles, moons, flowers, etc.) repeated across
 * the full viewport. Each motif is rotated and offset so the tiling never
 * looks grid-locked.
 */
'use client';

/* ─── Doodle ink color ─── */
const INK = '#8B7355';  // dark creamy / warm umber

export default function DoodleBackground() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.18 }}
        >
            <defs>
                <pattern
                    id="doodles"
                    x="0" y="0"
                    width="220" height="220"
                    patternUnits="userSpaceOnUse"
                >
                    {/* ── 4-petal flower ── */}
                    <g transform="translate(20,18) rotate(15)">
                        <ellipse cx="0" cy="-7" rx="3.5" ry="6" fill={INK}/>
                        <ellipse cx="0" cy="7"  rx="3.5" ry="6" fill={INK}/>
                        <ellipse cx="-7" cy="0" rx="6" ry="3.5" fill={INK}/>
                        <ellipse cx="7"  cy="0" rx="6" ry="3.5" fill={INK}/>
                        <circle cx="0" cy="0" r="3.5" fill={INK}/>
                    </g>

                    {/* ── 5-point star ── */}
                    <g transform="translate(90,15) rotate(-10)">
                        <polygon points="0,-9 2.1,-3.1 8.6,-2.8 3.5,1.2 5.3,7.8 0,4.2 -5.3,7.8 -3.5,1.2 -8.6,-2.8 -2.1,-3.1"
                            fill={INK}/>
                    </g>

                    {/* ── Heart ── */}
                    <g transform="translate(160,22) rotate(8)">
                        <path d="M0,5 C0,5 -10,-2 -10,-7 C-10,-12 -3,-13 0,-8 C3,-13 10,-12 10,-7 C10,-2 0,5 0,5 Z"
                            fill={INK}/>
                    </g>

                    {/* ── Speech bubble ── */}
                    <g transform="translate(195,75) rotate(-5)">
                        <rect x="-12" y="-9" width="24" height="16" rx="5" fill={INK}/>
                        <polygon points="-4,7 4,7 0,14" fill={INK}/>
                        <circle cx="-4" cy="-1" r="2" fill="white" opacity="0.8"/>
                        <circle cx="4"  cy="-1" r="2" fill="white" opacity="0.8"/>
                    </g>

                    {/* ── Leaf ── */}
                    <g transform="translate(50,65) rotate(35)">
                        <path d="M0,-12 C6,-6 6,6 0,12 C-6,6 -6,-6 0,-12 Z" fill={INK}/>
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="white" strokeWidth="1" opacity="0.5"/>
                    </g>

                    {/* ── Lightning bolt ── */}
                    <g transform="translate(130,70) rotate(-8)">
                        <polygon points="4,-12 -2,-1 3,-1 -4,12 2,0 -3,0" fill={INK}/>
                    </g>

                    {/* ── Moon crescent ── */}
                    <g transform="translate(22,115) rotate(20)">
                        <path d="M4,-10 C10,-6 10,6 4,10 C-4,8 -8,2 -8,-1 C-2,3 6,2 6,-1 C6,-5 -2,-6 -8,-3 C-8,-6 -4,-12 4,-10 Z"
                            fill={INK}/>
                    </g>

                    {/* ── Sparkle (4-point star with thin arms) ── */}
                    <g transform="translate(100,105) rotate(10)">
                        <polygon points="0,-11 1.5,-1.5 11,0 1.5,1.5 0,11 -1.5,1.5 -11,0 -1.5,-1.5" fill={INK}/>
                    </g>

                    {/* ── Smiley face ── */}
                    <g transform="translate(170,110) rotate(-12)">
                        <circle cx="0" cy="0" r="10" fill="none" stroke={INK} strokeWidth="2"/>
                        <circle cx="-3.5" cy="-2" r="1.5" fill={INK}/>
                        <circle cx="3.5"  cy="-2" r="1.5" fill={INK}/>
                        <path d="M-4,3 Q0,7 4,3" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round"/>
                    </g>

                    {/* ── Music note ── */}
                    <g transform="translate(60,150) rotate(5)">
                        <ellipse cx="0" cy="0" rx="5" ry="3.5" transform="rotate(-20)" fill={INK}/>
                        <line x1="4.5" y1="-1" x2="4.5" y2="-13" stroke={INK} strokeWidth="2"/>
                        <line x1="4.5" y1="-13" x2="11" y2="-10" stroke={INK} strokeWidth="2"/>
                    </g>

                    {/* ── Arrow doodle ── */}
                    <g transform="translate(140,155) rotate(-20)">
                        <line x1="-10" y1="0" x2="10" y2="0" stroke={INK} strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="4,-5 10,0 4,5" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>

                    {/* ── Diamond ── */}
                    <g transform="translate(200,155) rotate(8)">
                        <polygon points="0,-10 7,0 0,10 -7,0" fill={INK}/>
                        <polygon points="0,-10 7,0 0,-2 -7,0" fill="white" opacity="0.3"/>
                    </g>

                    {/* ── Small 6-petal flower ── */}
                    <g transform="translate(22,192) rotate(-5)">
                        {[0,60,120,180,240,300].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx={Math.round(Math.cos((angle * Math.PI) / 180) * 5)}
                                cy={Math.round(Math.sin((angle * Math.PI) / 180) * 5)}
                                rx="3" ry="5"
                                transform={`rotate(${angle} ${Math.round(Math.cos((angle * Math.PI) / 180) * 5)} ${Math.round(Math.sin((angle * Math.PI) / 180) * 5)})`}
                                fill={INK}
                            />
                        ))}
                        <circle cx="0" cy="0" r="3" fill={INK}/>
                    </g>

                    {/* ── Eye / awake icon ── */}
                    <g transform="translate(105,195) rotate(5)">
                        <path d="M-13,0 C-8,-8 8,-8 13,0 C8,8 -8,8 -13,0 Z"
                            fill="none" stroke={INK} strokeWidth="2"/>
                        <circle cx="0" cy="0" r="4.5" fill={INK}/>
                        <circle cx="1.5" cy="-1.5" r="1.5" fill="white" opacity="0.6"/>
                    </g>

                    {/* ── Wavy line ── */}
                    <g transform="translate(155,198)">
                        <path d="M-18,0 C-12,-6 -6,6 0,0 C6,-6 12,6 18,0"
                            fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"/>
                    </g>

                    {/* ── Tiny dots cluster ── */}
                    <g transform="translate(200,25)">
                        <circle cx="-5" cy="0" r="2.5" fill={INK}/>
                        <circle cx="0"  cy="-5" r="2.5" fill={INK}/>
                        <circle cx="5"  cy="0" r="2.5" fill={INK}/>
                    </g>

                    {/* ── Star outline (6-point) ── */}
                    <g transform="translate(75,20) rotate(5)">
                        <polygon points="0,-8 2,−2.5 8,-2.5 3,1 5,7.5 0,4 -5,7.5 -3,1 -8,-2.5 -2,-2.5"
                            fill={INK} opacity="0.7"/>
                    </g>

                </pattern>
            </defs>

            {/* Fill the entire viewport with the doodle tile */}
            <rect width="100%" height="100%" fill="url(#doodles)"/>
        </svg>
    );
}
