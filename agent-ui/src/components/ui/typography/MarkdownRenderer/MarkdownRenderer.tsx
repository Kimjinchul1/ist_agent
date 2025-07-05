import { type FC } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'

import { type MarkdownRendererProps } from './types'
import { inlineComponents } from './inlineStyles'
import { components } from './styles'

const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  children,
  classname,
  inline = false
}) => (
  <ReactMarkdown
    className={cn(
      'prose prose-gray max-w-none',
      'prose-headings:font-semibold prose-headings:text-gray-900',
      'prose-p:text-gray-800 prose-p:leading-relaxed',
      'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
      'prose-strong:text-gray-900 prose-strong:font-semibold',
      'prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono',
      'prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200',
      'prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50 prose-blockquote:py-2',
      'prose-ul:list-disc prose-ol:list-decimal',
      'prose-li:text-gray-800',
      'prose-table:border-collapse prose-table:border prose-table:border-gray-300',
      'prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2',
      'prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2',
      classname
    )}
    components={{ ...(inline ? inlineComponents : components) }}
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[
      rehypeRaw,
      rehypeSanitize,
      rehypeHighlight,
      rehypeKatex
    ]}
  >
    {children}
  </ReactMarkdown>
)

export default MarkdownRenderer
