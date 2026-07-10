'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react'

interface EmptyStateProps {
  icon?: 'search' | 'building' | 'users' | 'document' | 'chart' | 'settings' | 'alert'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

const iconMap = {
  search: Search,
  building: Building2,
  users: Users,
  document: FileText,
  chart: BarChart3,
  settings: Settings,
  alert: AlertCircle,
}

export function EmptyState({
  icon = 'search',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  const IconComponent = iconMap[icon]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-lg bg-zinc-900/50 p-4 mb-4">
        <IconComponent className="h-12 w-12 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 text-center max-w-md mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-yellow-500 text-black hover:bg-yellow-600 font-semibold"
          >
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            onClick={onSecondaryAction}
            variant="outline"
            className="border-zinc-700 text-zinc-100 hover:bg-zinc-800"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export function EmptyLeads() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardContent className="pt-6">
        <EmptyState
          icon="search"
          title="No leads found"
          description="Try adjusting your search or filter criteria to find leads"
          actionLabel="Clear Filters"
          onAction={() => {
            // Clear filters logic
          }}
          secondaryActionLabel="Add Lead"
          onSecondaryAction={() => {
            // Add lead logic
          }}
        />
      </CardContent>
    </Card>
  )
}

export function EmptyProjects() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardContent className="pt-6">
        <EmptyState
          icon="building"
          title="No projects found"
          description="Start by creating your first project to begin tracking development progress"
          actionLabel="Create Project"
          onAction={() => {
            // Create project logic
          }}
          secondaryActionLabel="Browse Templates"
          onSecondaryAction={() => {
            // Browse templates logic
          }}
        />
      </CardContent>
    </Card>
  )
}

export function EmptyUsers() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardContent className="pt-6">
        <EmptyState
          icon="users"
          title="No users found"
          description="Invite team members to collaborate on your projects"
          actionLabel="Invite Users"
          onAction={() => {
            // Invite users logic
          }}
        />
      </CardContent>
    </Card>
  )
}

export function EmptyDocuments() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardContent className="pt-6">
        <EmptyState
          icon="document"
          title="No documents found"
          description="Upload or create documents to manage your project files"
          actionLabel="Upload Document"
          onAction={() => {
            // Upload document logic
          }}
          secondaryActionLabel="Create Template"
          onSecondaryAction={() => {
            // Create template logic
          }}
        />
      </CardContent>
    </Card>
  )
}

export function EmptyAnalytics() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardContent className="pt-6">
        <EmptyState
          icon="chart"
          title="No data available"
          description="Analytics data will appear here once you start tracking project metrics"
          actionLabel="View Guide"
          onAction={() => {
            // View guide logic
          }}
        />
      </CardContent>
    </Card>
  )
}

export function EmptySettings() {
  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardContent className="pt-6">
        <EmptyState
          icon="settings"
          title="No settings configured"
          description="Configure your preferences to customize your experience"
          actionLabel="Configure Settings"
          onAction={() => {
            // Configure settings logic
          }}
        />
      </CardContent>
    </Card>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  actionLabel = 'Retry',
  onAction,
}: {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <Card className="border-red-500/30 bg-red-950/20">
      <CardContent className="pt-6">
        <EmptyState
          icon="alert"
          title={title}
          description={description}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      </CardContent>
    </Card>
  )
}

export function NoConnectionState({
  onRetry,
}: {
  onRetry?: () => void
}) {
  return (
    <Card className="border-amber-500/30 bg-amber-950/20">
      <CardContent className="pt-6">
        <EmptyState
          icon="alert"
          title="Connection lost"
          description="Unable to connect to the server. Check your internet connection and try again."
          actionLabel="Retry"
          onAction={onRetry}
        />
      </CardContent>
    </Card>
  )
}

export function LoadingErrorState({
  onRetry,
}: {
  onRetry?: () => void
}) {
  return (
    <Card className="border-red-500/30 bg-red-950/20">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="rounded-lg bg-red-900/50 p-4 mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-100 mb-2">Failed to load</h3>
          <p className="text-sm text-red-300 text-center max-w-md mb-6">
            An error occurred while loading this content. Please try again.
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={onRetry}
              className="bg-red-600 text-white hover:bg-red-700 font-semibold"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function UnauthorizedState() {
  return (
    <Card className="border-red-500/30 bg-red-950/20">
      <CardContent className="pt-6">
        <EmptyState
          icon="alert"
          title="Access denied"
          description="You don't have permission to view this content. Contact your administrator for access."
        />
      </CardContent>
    </Card>
  )
}

export function MaintenanceState() {
  return (
    <Card className="border-amber-500/30 bg-amber-950/20">
      <CardContent className="pt-6">
        <EmptyState
          icon="alert"
          title="Under maintenance"
          description="This feature is temporarily unavailable. We'll be back online shortly."
        />
      </CardContent>
    </Card>
  )
}
