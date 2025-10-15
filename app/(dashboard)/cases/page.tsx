import { Suspense } from "react";
import { CasesSearch } from "@/components/features/cases/cases-search";
import { CasesTable } from "@/components/features/cases/cases-table";
import { Skeleton } from "@/components/ui/skeleton";
import { caseSearchParamsSchema } from "@/schemas/case";

export const dynamic = "force-dynamic";

interface CasesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = await searchParams;
  const validatedParams = caseSearchParamsSchema.parse(params);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <CasesSearch />
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <CasesTable searchParams={validatedParams} />
      </Suspense>
    </div>
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
            <Skeleton className="h-4 w-32" /> {/* Vụ án */}
            <Skeleton className="h-4 w-24" /> {/* Trạng thái */}
            <Skeleton className="h-4 w-28" /> {/* Người thụ lý */}
            <Skeleton className="h-4 w-24" /> {/* Ngày tạo */}
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
              {/* Vụ án column */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Trạng thái column */}
              <div className="w-32">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Người thụ lý column */}
              <div className="w-36">
                <Skeleton className="h-3 w-28" />
              </div>

              {/* Ngày tạo column */}
              <div className="w-28">
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
