"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Inbox, Search, WifiOff, ServerCrash } from "lucide-react"

type EmptyStateType = "default" | "no-data" | "no-results" | "error" | "offline" | "server-error"

interface EmptyStateProps {
  type?: EmptyStateType
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

const typeIcons: Record<EmptyStateType, React.ReactNode> = {
  default: <Inbox className="h-12 w-12 text-muted-foreground" />,
  "no-data": <Inbox className="h-12 w-12 text-muted-foreground" />,
  "no-results": <Search className="h-12 w-12 text-muted-foreground" />,
  error: <AlertCircle className="h-12 w-12 text-destructive" />,
  offline: <WifiOff className="h-12 w-12 text-warning" />,
  "server-error": <ServerCrash className="h-12 w-12 text-destructive" />,
}

const EmptyState = ({
  type = "default",
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
      {icon || typeIcons[type]}
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    {description && <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)
EmptyState.displayName = "EmptyState"

interface LoadingSkeletonProps {
  count?: number
  className?: string
  variant?: "card" | "row" | "grid"
}

const LoadingSkeleton = ({ count = 3, className, variant = "card" }: LoadingSkeletonProps) => {
  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mb-2 h-3 w-full animate-pulse rounded bg-muted" />
            <div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-8 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "row") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 rounded-lg border border-border bg-card p-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
LoadingSkeleton.displayName = "LoadingSkeleton"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-12 w-12 text-destructive" />
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="mb-6 max-w-md text-sm text-muted-foreground">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    )}
  </div>
)
ErrorState.displayName = "ErrorState"

interface SuccessStateProps {
  title: string
  message?: string
  action?: React.ReactNode
  className?: string
}

const SuccessState = ({ title, message, action, className }: SuccessStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
      <svg className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    {message && <p className="mb-6 max-w-md text-sm text-muted-foreground">{message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)
SuccessState.displayName = "SuccessState"

export { EmptyState, LoadingSkeleton, ErrorState, SuccessState }
