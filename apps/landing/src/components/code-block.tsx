import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'
import { useEffect, useRef } from 'react'

export function CodeBlock({
  code,
  language = 'tsx',
  className = '',
}: {
  code: string
  language?: string
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current)
    }
  }, [code])

  return (
    <pre
      className={`overflow-auto p-6 text-[12.5px] leading-relaxed whitespace-pre ${className}`}
    >
      <code ref={ref} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  )
}
