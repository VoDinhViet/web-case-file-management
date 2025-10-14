import { Suspense } from "react";
import { StaffTable } from "@/components/features/staff/staff-table";
import { Skeleton } from "@/components/ui/skeleton";
import { staffSearchParamsSchema } from "@/schemas/staff";

interface StaffPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const params = await searchParams;
  const validatedParams = staffSearchParamsSchema.parse(params);
  const key = `${validatedParams.page}-${validatedParams.q || ""}`;

  return (
    <Suspense fallback={<TableSkeleton />} key={key}>
      <StaffTable searchParams={params} />
    </Suspense>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Table Header */}
        <div className="bg-muted/50 border-b">
          <div className="flex items-center h-12 px-6 gap-6">
            <Skeleton className="h-4 w-32" /> {/* Nhân viên */}
            <Skeleton className="h-4 w-24" /> {/* Liên hệ */}
            <Skeleton className="h-4 w-20" /> {/* Vụ án */}
            <Skeleton className="h-4 w-28" /> {/* Ngày tham gia */}
            <Skeleton className="h-4 w-20 ml-auto" /> {/* Thao tác */}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {Array.from({ length: 10 }, (_, i) => i).map((index) => (
            <div
              key={`skeleton-row-${index}`}
              className={`flex items-center px-6 py-4 gap-6 ${
                index % 2 === 0 ? "bg-background" : "bg-muted/10"
              }`}
            >
              {/* Nhân viên column */}
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>

              {/* Liên hệ column */}
              <div className="flex items-center gap-2 w-40">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-28" />
              </div>

              {/* Vụ án column */}
              <div className="flex items-center gap-2 w-28">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              {/* Ngày tham gia column */}
              <div className="flex items-center gap-2 w-36">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Thao tác column */}
              <div className="flex justify-center w-20 ml-auto">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
