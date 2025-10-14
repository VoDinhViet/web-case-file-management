import { PageHeader } from "@/components/layout/page-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Thống kê theo trạng thái"
        description="Tổng quan phân bố trạng thái xử lý các case"
      />
      {children}
    </div>
  );
}
