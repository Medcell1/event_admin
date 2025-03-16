import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddEditMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddEditMemberModal({ isOpen, onClose }: AddEditMemberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Enter role" />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" placeholder="Enter image URL" />
          </div>
          <Button type="submit" className="w-full">
            Add Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

