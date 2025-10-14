import type { ReactNode } from "react";
import { Suspense } from "react";
import { CreateStaffDialog } from "@/components/features/staff/create-staff-dialog";
import { StaffSearch } from "@/components/features/staff/staff-search";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý nhân sự"
        description="Quản lý thông tin nhân viên trong hệ thống"
      />

      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-sm" />}>
          <StaffSearch />
        </Suspense>
        <CreateStaffDialog />
      </div>

      {children}
    </div>
  );
}
