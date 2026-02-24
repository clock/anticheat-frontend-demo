import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'

const STORAGE_KEY = 'anticheat_demo_dismissed'

export function DemoDisclaimer() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog open>
      <DialogContent
        className="max-w-md bg-card border border-secondary"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg">UI Demo — No Real Data</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground space-y-2 text-left">
            <p>
              This is an open-source showcase of a CS:GO anti-cheat administration panel.
              <strong className="text-foreground"> All data shown is entirely fake</strong> and generated
              for demonstration purposes only.
            </p>
            <p>
              No real player data, detection records, Steam accounts, or backend systems are present.
              Actions such as banning or flagging users have no effect.
            </p>
            <p className="text-xs text-muted-foreground/70 pt-1">
              Source code available on GitHub.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDismiss} className="w-full">
            Got it — View Demo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
