'use client';

import { motion } from 'framer-motion';
import PicoFace from '@/components/pico/PicoFace';
import Button from '@/components/ui/Button';
import DoodleBackground from '@/components/shared/DoodleBackground';

export default function NotFound() {
    return (
        <section className="pt-18 relative min-h-[85vh] flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Radial gradient bloom behind face */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 203, 71, 0.12) 0%, transparent 70%)',
                }}
            />

            {/* Doodle pattern background */}
            <DoodleBackground />

            {/* Confused PicoFace */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <PicoFace expression="confused" size="lg" interactive={true} autoAnimate={true} />
            </motion.div>

            {/* Error Message */}
            <motion.h1
                className="text-display-md sm:text-display-lg text-ink text-center mt-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                404 - Not Found<span className="text-periwinkle">.</span>
            </motion.h1>

            <motion.p
                className="text-body-lg text-ink-light text-center max-w-lg mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Whoops! Pico seems a bit lost.
            </motion.p>

            <motion.p
                className="text-body-md text-ink-muted text-center max-w-md mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                The page you are looking for does not exist or has been moved.
            </motion.p>

            {/* Back to Home Button */}
            <motion.div
                className="flex mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <Button variant="primary" href="/">
                    Go Back Home
                </Button>
            </motion.div>
        </section>
    );
}
