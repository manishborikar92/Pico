/**
 * Centralized expression configuration — Single source of truth.
 * Used by PicoFace.js, PersonalitySection.js, and WhatIsPicoSection.js.
 *
 * Each expression maps to:
 *   - label:   Display name shown in UI
 *   - trigger: What causes this state
 *   - audio:   Sound effect description
 *   - color:   Rainbow accent color for UI badges
 */

/* ─── Full Expression Definitions ─── */
export const EXPRESSIONS = {
    idle: { label: 'IDLE', trigger: 'Default state', audio: 'Subtle breathing sounds', color: '#78716C' },
    happy: { label: 'HAPPY', trigger: 'Touch / known face', audio: 'Happy chirp 🎵', color: '#7ED957' },
    curious: { label: 'CURIOUS', trigger: 'Unknown face detected', audio: 'Questioning chirp 🎵', color: '#FFCB47' },
    listening: { label: 'LISTENING', trigger: 'Wake-word heard', audio: 'Acknowledgment bing 🎵', color: '#4ECDC4' },
    thinking: { label: 'THINKING', trigger: 'Processing query', audio: 'Thinking hum 🎵', color: '#45B7D1' },
    loved: { label: 'LOVED', trigger: 'Being petted', audio: 'Contented purring 🎵', color: '#FF85A1' },
    surprised: { label: 'SURPRISED', trigger: 'Picked up suddenly', audio: 'Startled beep 🎵', color: '#FF9E40' },
    confused: { label: 'CONFUSED', trigger: 'Command error', audio: 'Womp-womp sound 🎵', color: '#C77DFF' },
    sleepy: { label: 'SLEEPY', trigger: 'Long idle period', audio: 'Soft yawn 🎵', color: '#45B7D1' },
    obedient: { label: 'OBEDIENT', trigger: 'Command understood', audio: 'Acknowledgment chirp 🎵', color: '#8B9CF4' },
    error: { label: 'ERROR', trigger: 'System error', audio: 'Error buzz 🎵', color: '#FF6B6B' },
    low_battery: { label: 'LOW BATTERY', trigger: 'Battery < 15%', audio: 'Tired yawn 🎵', color: '#FF6B6B' },
    dizzy: { label: 'DIZZY', trigger: 'Shaken / tilted', audio: 'Wobbly sound 🎵', color: '#FF9E40' },
    angry: { label: 'ANGRY', trigger: 'Shaken aggressively', audio: 'Stop sound 🎵', color: '#FF6B6B' },
};

/* ─── Ordered key list for iteration ─── */
export const EXPRESSION_KEYS = Object.keys(EXPRESSIONS);

/**
 * Returns an array of { key, ...expressionData } for mapping in React components.
 * Optionally filter to a subset of keys.
 *
 * @param {string[]} [keys] - Optional subset of keys (defaults to all)
 * @returns {Array<{ key: string, label: string, trigger: string, audio: string, color: string }>}
 */
export function getExpressionList(keys) {
    const list = keys || EXPRESSION_KEYS;
    return list.map((key) => ({ key, ...EXPRESSIONS[key] }));
}

/* ─── Rainbow dot colors (for carousel indicators) ─── */
export const DOT_COLORS = [
    '#FF6B6B', '#FF9E40', '#FFCB47', '#7ED957',
    '#4ECDC4', '#45B7D1', '#8B9CF4', '#C77DFF',
    '#FF85A1', '#78716C', '#FF6B6B', '#FF9E40',
    '#45B7D1', '#C77DFF',
];
