import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { TemplateSearch } from "@/components/features/templates/template-search";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý mẫu vụ án"
        description="Quản lý các mẫu tài liệu cho vụ án"
      />

      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-sm" />}>
          <TemplateSearch />
        </Suspense>
        <Button asChild>
          <Link href="/templates/create">Tạo mẫu mới</Link>
        </Button>
      </div>

      {children}
    </div>
  );
}
