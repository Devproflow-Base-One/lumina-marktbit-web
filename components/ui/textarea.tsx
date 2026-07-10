'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  className, 
  'aria-label': ariaLabel, 
  'aria-describedby': ariaDescribedby, 
  'aria-invalid': ariaInvalid,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
