'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof switchVariants> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  'aria-label'?: string
  'aria-describedby'?: string
}

const switchVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
    default: '',
  },
      state: {
    checked: 'bg-primary',
    unchecked: 'bg-muted-foreground/40',
  },
    },
    defaultVariants: {
      variant: 'default',
      state: 'unchecked',
    },
  }
)

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, variant, checked, onCheckedChange, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false)

    React.useEffect(() => {
      setIsChecked(checked || false)
    }, [checked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <div className="relative">
        <input 
          type="checkbox" 
          ref={ref} 
          checked={isChecked} 
          onChange={handleChange} 
          className="sr-only" 
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          aria-checked={isChecked}
          {...props} 
        />
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-label={ariaLabel}
          onClick={() => {
            const newState = !isChecked
            setIsChecked(newState)
            onCheckedChange?.(newState)
          }}
          className={cn(
            switchVariants({ variant, state: isChecked ? 'checked' : 'unchecked', className })
          )}
        >
          <span
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
              isChecked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch, switchVariants }
