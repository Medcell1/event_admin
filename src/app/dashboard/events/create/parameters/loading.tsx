// loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-10 w-full bg-gray-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-300" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-300" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-10 w-full bg-gray-200" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-10 w-full bg-gray-200" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-32 w-full bg-gray-200" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-40 w-full bg-gray-200" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 bg-gray-300" />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-4">
            <Skeleton className="h-4 w-32 bg-gray-300 mb-4" />
            <div className="border rounded-md p-4 bg-gray-50">
              <Skeleton className="h-64 w-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}