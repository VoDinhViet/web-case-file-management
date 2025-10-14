import { Skeleton } from "@/components/ui/skeleton";

export function CasesTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Table Header */}
        <div className="bg-muted/50 border-b">
          <div className="flex items-center h-12 px-6 gap-6">
            {/* Tên vụ án */}
            <Skeleton className="h-4 w-56" />
            {/* Điều */}
            <Skeleton className="h-4 w-16" />
            {/* Loại tội phạm */}
            <Skeleton className="h-4 w-28" />
            {/* Số bị can */}
            <Skeleton className="h-4 w-20" />
            {/* Ngày khởi tố */}
            <Skeleton className="h-4 w-28" />
            {/* Ngày hết hạn */}
            <Skeleton className="h-4 w-28" />
            {/* Thao tác */}
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {Array.from({ length: 10 }, (_, index) => index).map((index) => (
            <div
              key={`case-skeleton-row-${index}`}
              className={`flex items-center px-6 py-4 gap-6 ${
                index % 2 === 0 ? "bg-background" : "bg-muted/10"
              }`}
            >
              {/* Tên vụ án */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-2 w-48" />
              </div>

              {/* Điều */}
              <div className="w-20">
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Loại tội phạm */}
              <div className="w-36">
                <Skeleton className="h-3 w-28" />
              </div>

              {/* Số bị can */}
              <div className="w-24">
                <Skeleton className="h-3 w-12" />
              </div>

              {/* Ngày khởi tố */}
              <div className="w-36">
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Ngày hết hạn */}
              <div className="w-36">
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Thao tác */}
              <div className="flex justify-center w-20 ml-auto">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
