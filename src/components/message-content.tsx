"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageContentProps {
  content: string;
  role: 'user' | 'assistant' | 'system' | 'data';
}

export function MessageContent({ content, role }: MessageContentProps) {
  // For user messages, render as plain text to preserve formatting
  if (role === 'user') {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // For assistant, system, and data messages, render as markdown
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert 
                    prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                    prose-p:text-gray-900 dark:prose-p:text-gray-100
                    prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                    prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0
                    prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0
                    prose-code:bg-gray-200 dark:prose-code:bg-gray-700 
                    prose-code:text-gray-900 dark:prose-code:text-gray-100
                    prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                    prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for code blocks
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-700 my-3">
              {children}
            </pre>
          ),
          // Custom styling for inline code
          code: ({ children, className }) => {
            const isCodeBlock = className?.includes('language-');
            if (isCodeBlock) {
              return <code className={`${className} text-gray-100`}>{children}</code>;
            }
            return (
              <code className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded text-xs">
                {children}
              </code>
            );
          },
          // Custom styling for tables
          table: ({ children }) => (
            <table className="border-collapse border border-gray-300 dark:border-gray-700 w-full my-3">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left text-gray-900 dark:text-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
              {children}
            </td>
          ),
          // Custom styling for headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 mt-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3 first:mt-0">
              {children}
            </h3>
          ),
          // Custom styling for lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 space-y-1 text-gray-900 dark:text-gray-100">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-2 space-y-1 text-gray-900 dark:text-gray-100">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-900 dark:text-gray-100">
              {children}
            </li>
          ),
          // Custom styling for paragraphs
          p: ({ children }) => (
            <p className="my-2 text-gray-900 dark:text-gray-100 leading-relaxed">
              {children}
            </p>
          ),
          // Custom styling for blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-3 italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
