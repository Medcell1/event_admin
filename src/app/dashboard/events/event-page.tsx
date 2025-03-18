"use client"
import { fonts } from "@/components/fonts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROUTES } from "@/constants/routes"
import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, ReactNode } from "react"

interface EventsPageProps {
  children: ReactNode;
}

export default function EventsPage({ children }: EventsPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  
  const categories = ["Music", "Technology", "Sports", "Arts", "Food", "Business"]
  
  // Update URL when filters change
  const updateSearchParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchParams("search", searchQuery)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateSearchParams("category", value === "all" ? "" : value)
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
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className={fonts.openSans}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => router.push(ROUTES.DASHBOARD.EVENTS.CREATE.PARAMETERS)} className={fonts.openSans}>
              Create Event
            </Button>
          </div>
        </div>
      </div>
      {/* Render children (EventsContainer) */}
      {children}
    </div>
  )
}