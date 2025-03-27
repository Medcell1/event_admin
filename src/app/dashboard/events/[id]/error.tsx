"use client"

import {  AlertTriangle, ArrowLeft, Link, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EventDetailsError() {

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
    <Card className="mx-auto w-full max-w-md shadow-lg">
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <CardTitle>Error Loading Event</CardTitle>
        </div>
        <CardDescription>We encountered an issue while trying to load this event.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 rounded-md bg-muted p-4">
          <p className="text-sm font-medium">Error details:</p>
          <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred</p>
        </div>
        <div className="space-y-4">
          <div className="text-sm">
            <p>You can try:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Refreshing the page</li>
              <li>Checking your connection</li>
              <li>Returning to the events list</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t bg-muted/20 p-4">
        <Button variant="outline" asChild>
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <Button >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  </div>
)
}
