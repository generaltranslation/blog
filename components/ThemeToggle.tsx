'use client'

import { cva } from 'class-variance-authority'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/components/components/lib/utils'
import { Button } from '@/components/components/ui/button'

// const buttonVariants = cva('size-6 rounded-full p-1 text-fd-muted-foreground', {
//   variants: {
//     dark: {
//       true: 'dark:bg-fd-accent dark:text-fd-accent-foreground',
//       false:
//         'bg-fd-accent text-fd-accent-foreground dark:bg-transparent dark:text-fd-muted-foreground',
//     },
//   },
// });

export default function ThemeToggle({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>): React.ReactElement {
  const { setTheme, resolvedTheme } = useTheme()

  const onToggle = (): void => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'relative h-7 w-[56px] rounded-full p-0.5',
        'transition-colors duration-300',
        className
      )}
      data-theme-toggle=""
      aria-label="Toggle Theme"
      onClick={onToggle}
      {...props}
    >
      <div
        className={cn(
          'absolute right-[29px] flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white transition-transform duration-300',
          resolvedTheme === 'dark' ? 'translate-x-[30px]' : 'translate-x-0'
        )}
      >
        {resolvedTheme === 'dark' && hasMounted ? (
          <Moon className="h-4 w-4 text-slate-900" />
        ) : (
          <Sun className="h-4 w-4 text-slate-900" />
        )}
      </div>
    </Button>
  )
}
