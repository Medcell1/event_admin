"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

export function TodaysEventsSkeleton() {
  const today = new Date()
  const formattedToday = format(today, "EEEE, MMMM d, yyyy")

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-background px-3 rounded-lg py-3">
        <div>
          <h1 className="text-3xl font-bold">Today's Events</h1>
          <p className="text-muted-foreground">{formattedToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex gap-2">
                <Tabs defaultValue="all" className="w-full sm:w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event card skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="md:flex">
              <div className="relative w-full md:w-64 h-48 md:h-auto">
                <Skeleton className="absolute inset-0" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="w-full md:w-3/5">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6 mb-1" />
                    <Skeleton className="h-4 w-4/6 mb-6" />
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Skeleton className="h-3 w-20 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Skeleton className="h-3 w-20 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full mb-2" />
                  <Skeleton className="h-3 w-36" />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <Skeleton className="h-10 w-36" />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center mt-6">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}