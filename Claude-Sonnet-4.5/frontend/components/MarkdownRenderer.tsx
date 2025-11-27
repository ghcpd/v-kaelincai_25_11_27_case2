import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  theme: 'light' | 'dark';
}

function MarkdownRenderer({ content, theme }: MarkdownRendererProps) {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'div'],
    ALLOWED_ATTR: ['href', 'class', 'target', 'rel']
  });

  return (
    <div 
      className={`markdown-content ${theme}`}
      data-theme={theme}
    >
      <ReactMarkdown
        components={{
          // Custom rendering for better theming
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-100" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
          li: ({node, ...props}) => <li className="ml-4" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
          em: ({node, ...props}) => <em className="italic text-gray-800 dark:text-gray-200" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 rounded-r" {...props} />
          ),
          code: ({node, ...props}: any) => {
            const isInline = props.className?.includes('inline') || !props.className;
            return isInline ? (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="block p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm font-mono overflow-x-auto" {...props} />
            );
          },
          a: ({node, ...props}) => (
            <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
