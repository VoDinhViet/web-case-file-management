import { Suspense } from "react";
import { TemplateTable } from "@/components/features/templates/template-table";
import { Skeleton } from "@/components/ui/skeleton";
import { templateSearchParamsSchema } from "@/schemas/template";
import { Button } from "@/components/ui/button";
import { TemplateSearch } from "@/components/features/templates/template-search";
import Link from "next/link";

interface TemplatesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const params = await searchParams;
  const validatedParams = templateSearchParamsSchema.parse(params);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-sm" />}>
          <TemplateSearch />
        </Suspense>
        <Button asChild>
          <Link href="/templates/create">Tạo mẫu mới</Link>
        </Button>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <TemplateTable searchParams={validatedParams} />
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
            <Skeleton className="h-4 w-40" /> {/* Tiêu đề */}
            <Skeleton className="h-4 w-24" /> {/* Danh mục */}
            <Skeleton className="h-4 w-20" /> {/* Lượt dùng */}
            <Skeleton className="h-4 w-28" /> {/* Ngày tạo */}
            <Skeleton className="h-4 w-20" /> {/* Trạng thái */}
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
              {/* Tiêu đề */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-2 w-48" />
              </div>

              {/* Danh mục */}
              <div className="w-28">
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>

              {/* Lượt dùng */}
              <div className="w-24">
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Ngày tạo */}
              <div className="flex items-center gap-2 w-36">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Trạng thái */}
              <div className="w-24">
                <Skeleton className="h-5 w-20 rounded-full" />
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
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
