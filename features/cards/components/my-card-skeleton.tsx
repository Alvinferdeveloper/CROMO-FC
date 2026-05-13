import { Skeleton } from "@/components/ui/skeleton"

export function MyCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-3/4 w-full rounded-none" />
      
      <div className="p-4 flex-1 flex flex-col gap-4">
        <div className="space-y-2">
          {/* Name Skeleton */}
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          {/* Team Skeleton */}
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>

        <div className="mt-auto space-y-2">
          {/* Main Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-xl" />
          
          <div className="flex gap-2">
            {/* Edit Button Skeleton */}
            <Skeleton className="h-10 flex-1 rounded-xl" />
            {/* Delete Button Skeleton */}
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
