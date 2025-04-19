"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Contributor } from "@/@types"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  contributor: Contributor | null
  onSubmit: (name: string) => Promise<void>
}

export default function ChangePasswordModal({ isOpen, onClose, contributor, onSubmit }: ChangePasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contributor) return

    setIsSubmitting(true)

    try {
      await onSubmit(contributor.name)
    } catch (error) {
      console.error("Error changing password:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Reset the password for {contributor?.name}. A new password will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-amber-600 bg-amber-50 p-3 rounded-md text-sm">
              Warning: This action will generate a new password. The current password will no longer work.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
