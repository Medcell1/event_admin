import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function EventDetailsSkeleton() {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex rounded-md px-4 py-4 flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-background">
        <div className="w-full md:w-1/2">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Overview Card */}
              <Card>
                <CardContent className="p-0">
                  <Skeleton className="w-full h-64 rounded-t-lg" />
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="w-full">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5 mt-1" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="w-full">
                          <Skeleton className="h-5 w-3/4 mb-1" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="w-full">
                          <Skeleton className="h-5 w-3/4 mb-1" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Skeleton className="h-6 w-28 mb-2" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="w-full">
                      <Skeleton className="h-5 w-1/3 mb-1" />
                      <Skeleton className="h-4 w-1/4 mb-1" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6 mt-6">
              {/* Ticket Sales Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full mb-1" />
                      <Skeleton className="h-3 w-20 mt-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col items-center">
                              <Skeleton className="h-8 w-8 rounded-full mb-2" />
                              <Skeleton className="h-8 w-16 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>

              {/* Ticket Types Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="w-full md:w-2/3">
                            <div className="flex items-center gap-2 mb-1">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-4 w-full md:w-3/4" />
                          </div>
                          <Skeleton className="h-6 w-20" />
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between mb-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Skeleton className="h-4 w-24" />
                          <div className="ml-auto flex gap-2">
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              {/* Analytics Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex flex-col items-center p-4 border rounded-lg">
                        <Skeleton className="h-8 w-8 rounded-full mb-2" />
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Event Stats Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <React.Fragment key={i}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                  {i < 4 && <Separator />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          {/* Event Timeline Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      {i < 3 && <div className="w-px h-full bg-border mt-1"></div>}
                    </div>
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}