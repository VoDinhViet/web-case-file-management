import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((k) => (
            <Skeleton key={`root-skel-${k}`} className="h-10" />
          ))}
        </div>
      </div>
    </div>
  );
}
