import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
