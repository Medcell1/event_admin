"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { CalendarIcon, Clock, Upload } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { removeImageFromIndexedDB, useEventForm } from "@/hooks/use-event-form"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { MultiSelect } from "@/components/ui/multi-select"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { fonts } from "@/components/fonts"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { toast } from "sonner"
import React, { useState, useEffect } from "react"
import { ROUTES } from "@/constants/routes"
import Select from "react-select"
import { EventCategory } from "@/@types"

const formSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.object({ _id: z.string(), name: z.string() }).array().min(1, "Please select at least one category"),
  bannerImage: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  categories: EventCategory[]
}

export default function EventParametersClientPage({ categories }: Props) {
  const router = useRouter()
  const { formData, updateEventParameters } = useEventForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState<number>(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name ?? "",
      date: formData.date ?? new Date(),
      time: formData.time ?? "",
      location: formData.location ?? "",
      description: formData.description ?? "",
      category: formData.category || [],
      bannerImage: formData.bannerImage || undefined,
    },
  })

  function onSubmit(values: FormValues) {
    if (values.bannerImage) {
      if (!values.bannerImage.type.startsWith("image/")) {
        toast.error("Invalid File Type", {
          description: "Please upload an image file (e.g., JPEG, PNG).",
        })
        return
      }

      if (values.bannerImage.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "The image must be less than 5MB.",
        })
        return
      }
    } else {
      toast.error("Banner Image Required", {
        description: "Please upload an image to proceed.",
      })
      return
    }

    const updatedValues = {
      ...values,
      bannerImage: values.bannerImage || formData.bannerImage,
    }
    updateEventParameters(updatedValues)
    router.push(ROUTES.DASHBOARD.EVENTS.CREATE.TICKETS)
  }

  function onError(errors: any) {
    toast.error("Form Validation Error", {
      description: "Please check the form for errors and try again.",
    })
  }

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File Type", {
          description: "Please upload an image file (e.g., JPEG, PNG).",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "The image must be less than 5MB.",
        })
        return
      }

      form.setValue("bannerImage", file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = async () => {
    form.setValue("bannerImage", undefined)
    setImagePreview(null)
    updateEventParameters({ bannerImage: null })
    await removeImageFromIndexedDB()
  }

  if (!isClient) {
    return null
  }

  return (
    <div className={`${fonts.poppins} text-gray-700 max-w-4xl`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
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
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        options={categories
                          .filter(({ _id }) => !field.value.some((selected) => selected._id === _id)) // Exclude already selected categories
                          .map(({ _id, name }) => ({ value: _id, label: name }))}
                        value={field.value.map(({ _id, name }) => ({ value: _id, label: name }))}
                        onChange={(selected) =>
                          field.onChange(selected.map(({ value, label }) => ({ _id: value, name: label })))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
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
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            key={fileInputKey}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageChange(file)
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
                                if (file) handleImageChange(file)
                              }
                              input.click()
                            }}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
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
        <div className="md:col-span-1">
          {(imagePreview || formData.bannerImage) && (
            <div className="sticky top-4">
              <h3 className="font-extrabold mb-4">Event Banner Preview</h3>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="relative">
                  <div className="overflow-hidden rounded-md border aspect-[3/4] w-full">
                    <img
                      src={
                        imagePreview ||
                        (formData.bannerImage instanceof File ? URL.createObjectURL(formData.bannerImage) : "")
                      }
                      alt="Banner preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}