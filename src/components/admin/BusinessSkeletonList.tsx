import { Skeleton } from "../shadcnui/skeleton";

const BusinessSkeleton = () => {
  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <Skeleton className="mx-auto h-6 w-10" />
          <Skeleton className="mx-auto mt-2 h-3 w-14" />
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <Skeleton className="mx-auto h-6 w-10" />
          <Skeleton className="mx-auto mt-2 h-3 w-14" />
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <Skeleton className="mx-auto h-6 w-10" />
          <Skeleton className="mx-auto mt-2 h-3 w-14" />
        </div>
      </div>
    </div>
  );
};

export const BusinessSkeletonList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <BusinessSkeleton key={`business-skeleton-${index}`} />
      ))}
    </div>
  );
};
