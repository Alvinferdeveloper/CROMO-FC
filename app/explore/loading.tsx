import { CardSkeleton } from "@/features/cards/components/card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] mt-20 bg-background overflow-hidden font-sans">
      <div className="max-w-[1440px] w-full mx-auto px-2 sm:px-4 flex-1 flex flex-col pt-6 min-h-0">
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-full sm:w-48 rounded-2xl" />
        </div>

        <div className="flex-1 flex gap-8 overflow-hidden min-h-0 mt-4">
          {/* Left Column Skeleton */}
          <div className="hidden lg:block w-64 space-y-6 pt-1">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Center Column Skeleton */}
          <div className="flex-1 overflow-y-auto px-1 min-h-0 pt-1">
            <div className="space-y-5 max-w-6xl mx-auto pb-20">
              <div className="space-y-2">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-8 w-64 rounded-xl" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="hidden xl:block w-80 space-y-6 pt-1">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-16 w-12 rounded-lg shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
