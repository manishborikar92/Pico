/**
 * CodeBlock — Syntax-highlighted code block using react-syntax-highlighter.
 * Uses a custom warm theme matching the cream palette.
 *
 * @param {string} language  – e.g. 'python', 'cpp', 'javascript'
 * @param {string} [filename] – Optional filename shown in header bar
 * @param {number[]} [highlight] – Lines to highlight with yellow bg
 * @param {string} children  – Code string
 */
'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

/* Custom warm-palette theme */
const warmTheme = {
    'pre[class*="language-"]': { background: '#F5F0E8', padding: '1.5rem', borderRadius: '4px', overflow: 'auto' },
    'code[class*="language-"]': { color: '#1C1917', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' },
    comment: { color: '#78716C' },
    string: { color: '#7ED957' },
    keyword: { color: '#8B9CF4' },
    function: { color: '#4ECDC4' },
    number: { color: '#FF9E40' },
    operator: { color: '#FF6B6B' },
    'class-name': { color: '#C77DFF' },
    boolean: { color: '#45B7D1' },
    punctuation: { color: '#44403C' },
};

export default function CodeBlock({ language = 'text', filename, highlight = [], children }) {
    return (
        <div className="rounded-sharp overflow-hidden border border-warm-gray-mid">
            {/* Header bar */}
            {(filename || language) && (
                <div className="flex items-center justify-between px-4 py-2 bg-warm-gray-light border-b border-warm-gray-mid">
                    {filename && (
                        <span className="text-caption text-ink-muted font-mono">{filename}</span>
                    )}
                    <span className="text-caption text-ink-muted uppercase tracking-wider">
                        {language}
                    </span>
                </div>
            )}

            <SyntaxHighlighter
                language={language}
                style={warmTheme}
                showLineNumbers
                wrapLines
                lineProps={(lineNumber) => {
                    const style = { display: 'block' };
                    if (highlight.includes(lineNumber)) {
                        style.backgroundColor = 'rgba(255, 203, 71, 0.15)';
                    }
                    return { style };
                }}
            >
                {String(children).trim()}
            </SyntaxHighlighter>
        </div>
    );
}
