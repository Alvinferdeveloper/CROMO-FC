import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-24 pt-32">
      <div className="container max-w-5xl mx-auto px-6">
        
        {/* Back button skeleton */}
        <div className="mb-10">
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">

          {/* Left column: Image Skeleton */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-start shrink-0">
            <Skeleton className="aspect-4/5 w-full max-w-[380px] rounded-[2rem]" />
          </div>

          {/* Right column: Info Skeletons */}
          <div className="w-full md:w-3/5 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-3/4 rounded-xl" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-6 border-y border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-5 w-32 rounded-lg" />
                </div>
              ))}
            </div>

            {/* Map Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-[320px] w-full rounded-2xl" />
            </div>

            {/* Contact zone skeleton */}
            <div className="pt-6 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-5 w-32 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
