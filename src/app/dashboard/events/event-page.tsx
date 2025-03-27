"use client"
import { fonts } from "@/components/fonts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ROUTES } from "@/constants/routes"
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, ReactNode, useCallback } from "react"
import { EventCategory } from "@/@types"
import EventCategoriesService from "@/actions/events/categories"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface EventsPageProps {
  children: ReactNode;
}

export default function EventsPage({ children }: EventsPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  
  // Get category IDs from URL params (comma-separated string)
  const categoryParam = searchParams.get("category") || ""
  const initialCategoryIds = categoryParam ? categoryParam.split(",") : []
  
  // Pagination params
  const pageParam = searchParams.get("page") || "1"
  const limitParam = searchParams.get("limit") || "10"
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam))
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(limitParam))
  
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialCategoryIds)
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  const updateSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchParams({ 
        search: searchQuery,
        page: "1" 
      })
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  useEffect(() => {
    updateSearchParams({ 
      category: selectedCategoryIds.join(","),
      page: "1" 
    })
  }, [selectedCategoryIds])

  useEffect(() => {
    updateSearchParams({ 
      page: currentPage.toString(),
      limit: itemsPerPage.toString()
    })
  }, [currentPage, itemsPerPage])

  const fetchCategories = useCallback(async () => {
    if (categories.length === 0 && !isLoadingCategories) {
      setIsLoadingCategories(true)
      try {
        const fetchedCategories = await EventCategoriesService.getAll()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
  }, [categories.length, isLoadingCategories])

  const handleOpenChange = (open: boolean) => {
    setIsCategoriesOpen(open)
    if (open) {
      fetchCategories()
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const getSelectedCategoryNames = () => {
    if (selectedCategoryIds.length === 0) return "All Categories"
    
    return categories
      .filter(cat => selectedCategoryIds.includes(cat._id))
      .map(cat => cat.name)
      .join(", ")
  }

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleChangeItemsPerPage = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="px-10 py-6 bg-white w-full rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className={`${fonts.poppins} text-xl`}>All Events</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${fonts.openSans}`}
              />
            </div>
            <div className="w-full sm:w-64">
              <Popover open={isCategoriesOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCategoriesOpen}
                    className={`w-full justify-between text-left ${fonts.openSans}`}
                  >
                    {selectedCategoryIds.length === 0 ? (
                      <span className="text-muted-foreground">All Categories</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                        {selectedCategoryIds.length > 1 ? (
                          <span>{selectedCategoryIds.length} categories selected</span>
                        ) : (
                          getSelectedCategoryNames()
                        )}
                      </div>
                    )}
                    <span className="ml-2 h-4 w-4 shrink-0 opacity-50">⌄</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." className={fonts.openSans} />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedCategoryIds([])}
                          className="flex items-center gap-2"
                        >
                          <div className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border",
                            selectedCategoryIds.length === 0 ? "bg-primary border-primary" : "opacity-50"
                          )}>
                            {selectedCategoryIds.length === 0 && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span>All Categories</span>
                        </CommandItem>
                        
                        {isLoadingCategories ? (
                          <div className="space-y-2 px-1 py-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                          </div>
                        ) : (
                          categories.map((category) => (
                            <CommandItem
                              key={category._id}
                              onSelect={() => toggleCategory(category._id)}
                              className="flex items-center gap-2"
                            >
                              <div className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border",
                                selectedCategoryIds.includes(category._id) ? "bg-primary border-primary" : "opacity-50"
                              )}>
                                {selectedCategoryIds.includes(category._id) && <Check className="h-3 w-3 text-primary-foreground" />}
                              </div>
                              <span>{category.name}</span>
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={() => router.push(ROUTES.DASHBOARD.EVENTS.CREATE.PARAMETERS)} className={fonts.openSans}>
              Create Event
            </Button>
          </div>
        </div>
      </div>
      
      {children}
      
      <div className="flex items-center justify-between px-4 py-4 bg-white rounded-lg relative z-10 mt-6">
      <div className="flex items-center gap-2">
          <span className={`text-sm text-muted-foreground ${fonts.openSans}`}>
            Items per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleChangeItemsPerPage(e.target.value)}
            className={`border rounded px-2 py-1 text-sm ${fonts.openSans}`}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          
          <span className={`text-sm mx-2 ${fonts.openSans}`}>
            Page {currentPage}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}