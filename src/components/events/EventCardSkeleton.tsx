import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function EventCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-[200px]" />
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="space-y-2 px-6 pt-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-3">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </CardFooter>
    </Card>
  );
}