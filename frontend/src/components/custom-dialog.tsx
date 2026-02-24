import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const CustomDialog = DialogPrimitive.Root

const CustomDialogTrigger = DialogPrimitive.Trigger

const CustomDialogPortal = DialogPrimitive.Portal

const CustomDialogClose = DialogPrimitive.Close

const CustomDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200",
      className
    )}
    {...props}
  />
))
CustomDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CustomDialogPortal>
    <CustomDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg transition-all duration-200 sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </CustomDialogPortal>
))
CustomDialogContent.displayName = DialogPrimitive.Content.displayName

export {
  CustomDialog,
  CustomDialogPortal,
  CustomDialogOverlay,
  CustomDialogClose,
  CustomDialogTrigger,
  CustomDialogContent,
}
