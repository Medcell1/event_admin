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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Ticket } from "@/hooks/use-event-form"
import { useEventForm } from "@/hooks/use-event-form"
import { ROUTES } from "@/constants/routes"

const ticketFormSchema = z.object({
  name: z.string().min(2, "Ticket name must be at least 3 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  description: z.string().min(2, "Decscription must be at least 10 characters"),
  visibility: z.enum(["public", "private"], {
    required_error: "Please select a visibility option",
  }),
  codePrefix: z.string().min(3, "Code prefix must be at least 2 characters"),
  totalSupply: z.string().regex(/^\d+$/, "Please enter a valid total supply"),
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
      description: "",
      visibility: "public",
      codePrefix: "",
      totalSupply: "",
    },
  })

  function onSubmit(values: z.infer<typeof ticketFormSchema>) {
    if (editingTicket) {
      editTicket(editingTicket.id, {
        ...values,
        price: Number.parseFloat(values.price),
        totalSupply: Number.parseInt(values.totalSupply),
      })
    } else {
      addTicket({
        ...values,
        price: Number.parseFloat(values.price),
        totalSupply: Number.parseInt(values.totalSupply),
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
      description: ticket.description,
      visibility: ticket.visibility,
      codePrefix: ticket.codePrefix,
      totalSupply: ticket.totalSupply.toString(),
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
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="totalSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Supply</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codePrefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code Prefix</FormLabel>
                        <FormControl>
                          <Input placeholder="EVT" {...field} />
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
                      <FormLabel>Description</FormLabel>
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
                <TableHead>Visibility</TableHead>
                <TableHead>Code Prefix</TableHead>

                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.name}</TableCell>
                  <TableCell>${ticket.price.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{ticket.visibility}</TableCell>
                  <TableCell className="capitalize">{ticket.codePrefix}</TableCell>

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