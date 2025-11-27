import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import clsx from 'clsx'

interface MarkdownContentProps {
  markdown: string
  className?: string
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      className={clsx('markdown-body', className)}
      // Allow limited HTML rendering with sanitization
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} rel="noopener noreferrer" target="_blank">
            {props.children}
          </a>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
