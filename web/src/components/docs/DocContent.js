/**
 * DocContent — Renders raw markdown content with styled HTML.
 * Uses a simple markdown-to-HTML approach with prose styling.
 * This is a server component (no 'use client') since it just renders HTML.
 */

/**
 * Very simple markdown-to-HTML converter.
 * Handles: headings, bold, italic, code blocks, inline code,
 * lists, links, horizontal rules, blockquotes, tables, and paragraphs.
 */
function markdownToHtml(md) {
    let html = md;

    /* Escape HTML entities except in code blocks */
    // We'll handle this during rendering

    /* Fenced code blocks ``` */
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<pre class="doc-code-block"><code class="language-${lang || 'text'}">${escapedCode}</code></pre>`;
    });

    /* Tables */
    html = html.replace(/^\|(.+)\|\s*\n\|[\s\-:|]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, (match, headerRow, bodyRows) => {
        const headers = headerRow.split('|').map(h => h.trim()).filter(Boolean);
        const headerHtml = headers.map(h => `<th>${h}</th>`).join('');

        const rows = bodyRows.trim().split('\n').map(row => {
            const cells = row.split('|').map(c => c.trim()).filter(Boolean);
            return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
        }).join('');

        return `<div class="doc-table-wrapper"><table class="doc-table"><thead><tr>${headerHtml}</tr></thead><tbody>${rows}</tbody></table></div>`;
    });

    /* Headings (## to ######) — process after code blocks */
    html = html.replace(/^######\s+(.+)$/gm, '<h6 class="doc-h6">$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="doc-h5">$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4 class="doc-h4">$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3 class="doc-h3">$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="doc-h2">$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1 class="doc-h1">$1</h1>');

    /* Horizontal rule */
    html = html.replace(/^---+$/gm, '<hr class="doc-hr" />');

    /* Blockquotes */
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="doc-blockquote">$1</blockquote>');

    /* Bold and italic */
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    /* Inline code (but not inside pre blocks) */
    html = html.replace(/`([^`]+)`/g, '<code class="doc-inline-code">$1</code>');

    /* Links */
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');

    /* Unordered lists (simple, single-level) */
    html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="doc-li">$1</li>');
    html = html.replace(/((?:<li class="doc-li">.*<\/li>\n?)+)/g, '<ul class="doc-ul">$1</ul>');

    /* Ordered lists */
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="doc-li-num">$1</li>');
    html = html.replace(/((?:<li class="doc-li-num">.*<\/li>\n?)+)/g, '<ol class="doc-ol">$1</ol>');

    /* Checkboxes */
    html = html.replace(/- \[x\]\s+(.+)/gi, '<div class="doc-check done">✅ $1</div>');
    html = html.replace(/- \[ \]\s+(.+)/gi, '<div class="doc-check">⬜ $1</div>');

    /* Paragraphs: wrap non-tagged lines */
    html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="doc-p">$1</p>');

    /* Clean up consecutive <p> tags around empty lines */
    html = html.replace(/<p class="doc-p"><\/p>/g, '');

    return html;
}

export default function DocContent({ content }) {
    const htmlContent = markdownToHtml(content);

    return (
        <div
            className="doc-prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
