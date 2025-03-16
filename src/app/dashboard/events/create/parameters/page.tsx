"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { CalendarIcon, Clock, Upload } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEventForm } from "@/hooks/use-event-form"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { MultiSelect } from "@/components/ui/multi-select"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { fonts } from "@/components/fonts"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { toast } from "sonner"
import React from "react"
import { ROUTES } from "@/constants/routes"

const formSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.array(z.string()).min(1, "Please select at least one category"),
  bannerImage: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof formSchema>

const categories = [
  { label: "Conference", value: "conference" },
  { label: "Workshop", value: "workshop" },
  { label: "Concert", value: "concert" },
  { label: "Exhibition", value: "exhibition" },
  { label: "Other", value: "other" },
]

export default function EventParametersPage() {
  const router = useRouter()
  const { formData, updateEventParameters } = useEventForm()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name ?? "",
      date: formData.date ?? new Date(),
      time: formData.time ?? "",
      location: formData.location ?? "",
      description: formData.description ?? "",
      category: formData.category || [],
    },
  })
  const handleCategoryChange = React.useCallback(
    (selectedValues: string[]) => {
      form.setValue("category", selectedValues)
    },
    [form]
  )

  function onSubmit(values: FormValues) {
    // Store the entire category array
    updateEventParameters({ ...values })
    router.push(ROUTES.DASHBOARD.EVENTS.CREATE.TICKETS)
  }

  function onError(errors: any) {
    toast.error("Form Validation Error", {
      description: "Please check the form for errors and try again.",
    })
  }

  return (
    <div className={`${fonts.poppins} text-gray-700 max-w-2xl`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-extrabold">Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Amazing Event" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-extrabold">Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-extrabold">Event Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" {...field} />
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-extrabold">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event venue or address" {...field} />
                </FormControl>
                <FormDescription>Enter the physical or virtual location of your event</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
    

              return (
                <FormItem>
                  <FormLabel className="font-extrabold">Category</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={categories}
                      onValueChange={handleCategoryChange}
                      defaultValue={field.value}
                      placeholder="Select categories"
                      asChild={true}
                      className="bg-background text-black hover:bg-white"
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-extrabold">Description</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="font-extrabold">Banner Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) onChange(file)
                      }}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "image/*"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) onChange(file)
                        }
                        input.click()
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Next: Tickets</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

