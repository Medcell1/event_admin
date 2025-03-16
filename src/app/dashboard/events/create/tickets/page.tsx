"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Edit, MoreHorizontal, Plus, TicketIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Ticket } from "@/hooks/use-event-form"
import { useEventForm } from "@/hooks/use-event-form"
import { ROUTES } from "@/constants/routes"

const ticketFormSchema = z.object({
  name: z.string().min(2, "Ticket name must be at least 2 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  quantity: z.string().regex(/^\d+$/, "Please enter a valid quantity"),
  description: z.string().optional(),
})

export default function TicketsPage() {
  const router = useRouter()
  const { formData, addTicket, editTicket, deleteTicket } = useEventForm()
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof ticketFormSchema>) {
    if (editingTicket) {
      editTicket(editingTicket.id, {
        ...values,
        price: Number.parseFloat(values.price),
        quantity: Number.parseInt(values.quantity),
      })
    } else {
      addTicket({
        ...values,
        price: Number.parseFloat(values.price),
        quantity: Number.parseInt(values.quantity),
      })
    }
    setIsDialogOpen(false)
    form.reset()
    setEditingTicket(null)
  }

  function handleEdit(ticket: Ticket) {
    setEditingTicket(ticket)
    form.reset({
      name: ticket.name,
      price: ticket.price.toString(),
      quantity: ticket.quantity.toString(),
      description: ticket.description,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Create and manage tickets for your event</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTicket ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
              <DialogDescription>
                {editingTicket ? "Edit the ticket details below" : "Add a new ticket type to your event"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Regular Ticket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any additional details about this ticket type..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      form.reset()
                      setEditingTicket(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingTicket ? "Save Changes" : "Create Ticket"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {formData.tickets.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.name}</TableCell>
                  <TableCell>${ticket.price.toFixed(2)}</TableCell>
                  <TableCell>{ticket.quantity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(ticket)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteTicket(ticket.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <TicketIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 font-semibold">No tickets yet</h3>
          <p className="text-sm text-muted-foreground">Create your first ticket to get started</p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.EVENTS.CREATE.PARAMETERS)} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={() => router.push(ROUTES.DASHBOARD.EVENTS.CREATE.PREVIEW)
        } disabled={formData.tickets.length === 0}>
          Next: Preview
        </Button>
      </div>
    </div>
  )
}

