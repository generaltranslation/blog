'use client'

import { useState } from 'react'
import { Link, Check } from 'lucide-react'

interface CopyLinkButtonProps {
  url: string
  className?: string
  iconSize?: number
}

export default function CopyLinkButton({ url, className = '', iconSize = 5 }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <button
      className={`hover:text-primary-500 dark:hover:text-primary-400 relative cursor-pointer fill-current text-gray-700 dark:text-gray-200 ${className}`}
      onClick={copyToClipboard}
      title="Copy link to clipboard"
      aria-label="Copy link to clipboard"
    >
      <div className="relative">
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}
        >
          <Check className={`h-${iconSize} w-${iconSize} text-green-500`} />
        </span>
        <span
          className={`flex items-center justify-center transition-opacity duration-300 ${copied ? 'opacity-0' : 'opacity-100'}`}
        >
          <Link className={`h-${iconSize} w-${iconSize}`} />
        </span>
      </div>
    </button>
  )
}
