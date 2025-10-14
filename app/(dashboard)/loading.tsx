import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Skeleton key={`dash-skel-${k}`} className="h-10" />
        ))}
      </div>
    </div>
  );
}
