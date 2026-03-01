/**
 * ComponentCard — Hardware component card.
 * Shows: component name, accent-colored top border, spec list (bullet points), price range.
 *
 * @param {string} name        – Component name (e.g. "ESP32-S3-EYE")
 * @param {string} accentColor – Color for top border accent
 * @param {string[]} specs     – 2-3 bullet-point specs
 * @param {string} price       – Price range string (e.g. "₹4,200–₹5,500")
 */
'use client';

import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { cardEntrance } from '@/lib/motion';

export default function ComponentCard({ name, accentColor, specs = [], price }) {
    return (
        <motion.div variants={cardEntrance}>
            <Card accentColor={accentColor} className="p-5">
                <h3 className="text-heading-sm text-ink mb-3">{name}</h3>
                <ul className="space-y-1 mb-4">
                    {specs.map((spec, i) => (
                        <li key={i} className="text-body-sm text-ink-light flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                            {spec}
                        </li>
                    ))}
                </ul>
                {price && (
                    <p className="text-body-sm font-medium text-ink">
                        {price}
                    </p>
                )}
            </Card>
        </motion.div>
    );
}
