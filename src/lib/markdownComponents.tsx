import type { Components } from 'react-markdown';

/**
 * Common Markdown components configuration for ReactMarkdown
 * Used by MessageBubble and VoiceBubble components
 */
export function getMarkdownComponents(): Components {
  return {
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-inherit hover:opacity-80 underline decoration-1 underline-offset-2 transition-opacity duration-200"
        {...props}
      >
        {children}
      </a>
    ),
    hr: ({ ...props }) => (
      <hr className="border-current/20 my-2" {...props} />
    ),
    h1: ({ children, ...props }) => (
      <h1
        className="text-lg font-semibold mb-1 mt-2 first:mt-0"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-base font-semibold mb-1 mt-2 first:mt-0"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-base font-medium mb-1 mt-1 first:mt-0"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-1 last:mb-0" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-1 last:mb-0 pl-4 space-y-0.5" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-1 last:mb-0 pl-4 space-y-0.5" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-base" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold" {...props}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-2 border-current/30 pl-2 italic text-current/80 my-1"
        {...props}
      >
        {children}
      </blockquote>
    ),
  };
}