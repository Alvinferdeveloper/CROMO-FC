import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <div className="relative h-full flex flex-col bg-card rounded-3xl border border-border overflow-hidden">
      {/* Image Container Skeleton */}
      <div className="relative aspect-4/5 overflow-hidden bg-muted/30 shrink-0">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Number badge skeleton */}
        <div className="absolute top-3 right-3 h-5 w-12 rounded-full bg-black/20" />

        {/* Location pill skeleton */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 items-start">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-6 w-32 rounded-xl" />
        </div>
      </div>

      {/* Info Container Skeleton */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-card">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-6 h-6 rounded-full shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-2 w-16 rounded-full" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 mt-1 border-t border-border">
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}
