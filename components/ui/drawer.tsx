"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type DrawerSide = "left" | "right" | "top" | "bottom"

interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: DrawerSide
  children: React.ReactNode
}

const sideClasses: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out",
  right: "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out",
  top: "inset-x-0 top-0 w-full border-b data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
  bottom: "inset-x-0 bottom-0 w-full border-t data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
}

const Drawer = ({ open, onOpenChange, side = "right", children }: DrawerProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[1300] bg-black/80 backdrop-blur-sm data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-[1300] gap-4 bg-card p-6 shadow-2xl transition ease-in-out",
          sideClasses[side]
        )}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
)
Drawer.displayName = "Drawer"

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = DialogPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DialogPrimitive.Description.displayName

export { Drawer, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription }
