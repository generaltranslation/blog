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
      className={`relative text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 ${className}`}
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
      {copied && (
        <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white">
          Copied!
        </span>
      )}
    </button>
  )
}
