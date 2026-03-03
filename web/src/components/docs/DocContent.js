/**
 * DocContent — Renders raw markdown content with next-mdx-remote
 * Uses standard components mapping to maintain doc-prose styling.
 * This is a server component since it just renders MDX to HTML.
 */
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

const components = {
    h1: (props) => <h1 className="doc-h1" {...props} />,
    h2: (props) => <h2 className="doc-h2" {...props} />,
    h3: (props) => <h3 className="doc-h3" {...props} />,
    h4: (props) => <h4 className="doc-h4" {...props} />,
    h5: (props) => <h5 className="doc-h5" {...props} />,
    h6: (props) => <h6 className="doc-h6" {...props} />,
    p: (props) => <p className="doc-p" {...props} />,
    a: (props) => {
        const href = props.href;
        if (href && href.startsWith('/')) {
            return <Link href={href} className="doc-link" {...props} />;
        }
        return <a target="_blank" rel="noopener noreferrer" className="doc-link" {...props} />;
    },
    ul: (props) => <ul className="doc-ul" {...props} />,
    ol: (props) => <ol className="doc-ol" {...props} />,
    li: (props) => <li className="doc-li" {...props} />,
    hr: (props) => <hr className="doc-hr" {...props} />,
    blockquote: (props) => <blockquote className="doc-blockquote" {...props} />,
    strong: (props) => <strong {...props} />,
    em: (props) => <em {...props} />,
    code: (props) => {
        if (props.className) {
            return <code {...props} />;
        }
        return <code className="doc-inline-code" {...props} />;
    },
    pre: (props) => <pre className="doc-code-block" {...props} />,
    table: (props) => (
        <div className="doc-table-wrapper">
            <table className="doc-table" {...props} />
        </div>
    ),
    th: (props) => <th {...props} />,
    td: (props) => <td {...props} />,
    img: (props) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="doc-img max-w-full h-auto rounded-standard my-4" {...props} alt={props.alt || ''} />
    ),
};

export default function DocContent({ content }) {
    return (
        <div className="doc-prose">
            <MDXRemote
                source={content}
                components={components}
                options={{ mdxOptions: { format: 'md' } }}
            />
        </div>
    );
}
