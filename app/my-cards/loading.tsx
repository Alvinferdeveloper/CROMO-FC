import { MyCardSkeleton } from "@/features/cards/components/my-card-skeleton"

export default function Loading() {
  return (
    <div className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-64 bg-muted animate-pulse rounded-xl" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
