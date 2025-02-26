'use client'

import { useEffect, useState, useRef } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import type { TOCInlineProps } from 'pliny/ui/TOCInline'

export default function ActiveTOC(props: TOCInlineProps) {
  const [activeId, setActiveId] = useState('')
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6')).filter(
      (element) => element.id
    )

    if (headingElements.length === 0) return

    const callback = (headings: IntersectionObserverEntry[]) => {
      // Get all headings that are currently visible
      const visibleHeadings = headings.filter((h) => h.isIntersecting)

      // If there are visible headings, set the first one as active
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].target.id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
      threshold: 0.5,
    })

    headingElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activeId) return

    // Find all links in the TOC
    const tocLinks = document.querySelectorAll('.active-toc a')

    // Remove active class from all links
    tocLinks.forEach((link) => {
      link.classList.remove('active')
    })

    // Add active class to the link that matches the active ID
    const activeLink = document.querySelector(`.active-toc a[href="#${activeId}"]`) as HTMLElement
    if (activeLink && indicatorRef.current) {
      activeLink.classList.add('active')

      // Position the indicator
      const linkRect = activeLink.getBoundingClientRect()
      const tocRect = activeLink.closest('.active-toc')?.getBoundingClientRect()

      if (tocRect) {
        // Calculate relative position to the TOC container
        const top = linkRect.top - tocRect.top
        const height = linkRect.height

        // Determine the left offset based on the heading level
        // H2 has no indent, H3+ has increasing indents
        const isNested = activeLink.closest('ul ul') !== null
        const leftOffset = isNested ? 12 : 0 // Adjust based on your actual indentation

        indicatorRef.current.style.transform = `translateY(${top}px)`
        indicatorRef.current.style.height = `${height}px`
        indicatorRef.current.style.left = `${leftOffset}px`
        indicatorRef.current.style.opacity = '1'
      }
    }
  }, [activeId])

  return (
    <div className="active-toc relative">
      <div
        ref={indicatorRef}
        className="bg-primary-500 dark:bg-primary-400 absolute w-1 rounded-full opacity-0 transition-all duration-300 ease-in-out"
        style={{ left: 0 }}
      />
      <style jsx global>{`
        .active-toc {
          position: relative;
        }
        .active-toc a {
          display: block;
          position: relative;
          transition: all 0.2s ease;
        }
        .active-toc a.active {
          color: var(--color-primary-500);
          font-weight: 500;
          transform: translateX(16px);
        }
        .dark .active-toc a.active {
          color: var(--color-primary-400);
        }
        .active-toc ul ul a {
          padding-left: 12px;
        }
      `}</style>
      <TOCInline {...props} />
    </div>
  )
}
