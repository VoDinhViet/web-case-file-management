import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page-header";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý nhân sự"
        description="Quản lý thông tin nhân viên trong hệ thống"
      />
      {children}
    </div>
  );
}
