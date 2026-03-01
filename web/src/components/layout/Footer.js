/**
 * Footer — Three-column layout on desktop, stacked on mobile.
 * Cream background (#F5F0E8). Top border: 1px solid warm gray mid.
 * Col 1: Logo + tagline. Col 2: Quick links. Col 3: Doc links.
 * Bottom strip: copyright + tech credits.
 */
import PicoFace from '@/components/pico/PicoFace';

const QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Hardware', href: '/#hardware' },
];

const DOC_LINKS = [
    { label: 'Overview', href: '/docs/overview' },
    { label: 'Dev Guide', href: '/docs/development-plan' },
    { label: 'Hardware Guide', href: '/docs/hardware' },
    { label: 'FAQ', href: '/docs/faq' },
];

export default function Footer() {
    return (
        <footer className="bg-warm-gray-light border-t border-warm-gray-mid">
            <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
                {/* Three-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                    {/* Col 1 — Logo + tagline */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <PicoFace size="sm" expression="idle" />
                            <span className="text-heading-sm font-bold font-display text-ink">Pico</span>
                        </div>
                        <p className="text-body-sm text-ink-light max-w-xs">
                            An emotionally responsive AI desktop companion that sees, hears, and feels.
                        </p>
                        <p className="text-caption text-ink-muted mt-2">
                            Built with ❤️ by Team PICO
                        </p>
                    </div>

                    {/* Col 2 — Quick links */}
                    <div>
                        <h3 className="text-heading-sm text-ink mb-4 font-display">Quick Links</h3>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-body-sm text-ink-light hover:text-periwinkle transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Documentation */}
                    <div>
                        <h3 className="text-heading-sm text-ink mb-4 font-display">Documentation</h3>
                        <ul className="space-y-2">
                            {DOC_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-body-sm text-ink-light hover:text-periwinkle transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="mt-12 pt-6 border-t border-warm-gray-mid flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-caption text-ink-muted">
                        © {new Date().getFullYear()} Project PICO. Open source, built to inspire.
                    </p>
                    <p className="text-caption text-ink-muted">
                        <a
                            href="https://www.vaelix.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-periwinkle transition-colors underline underline-offset-2"
                        >
                            A Product by Vaelix
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
