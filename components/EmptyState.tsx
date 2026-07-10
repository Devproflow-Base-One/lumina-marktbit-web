import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Search, FileText, Users, Building2, AlertCircle, Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'search' | 'file' | 'users' | 'building' | 'alert' | 'inbox'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  file: FileText,
  users: Users,
  building: Building2,
  alert: AlertCircle,
  inbox: Inbox,
}

export function EmptyState({
  icon = 'search',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const IconComponent = iconMap[icon]

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center">
          <IconComponent className="h-8 w-8 text-zinc-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          <p className="text-zinc-500 text-sm">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 mt-4"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
