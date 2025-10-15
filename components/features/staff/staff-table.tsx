import { getStaffList } from "@/actions";
import type { StaffSearchParams } from "@/schemas/staff";
import StaffTableClient from "./staff-table-client";

interface StaffTableProps {
  searchParams: StaffSearchParams;
}

export async function StaffTable({ searchParams }: StaffTableProps) {
  const result = await getStaffList(searchParams);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <p>{result.error || "Không thể tải danh sách nhân viên"}</p>
      </div>
    );
  }

  const staff = result.data || [];
  const pagination = result.pagination || null;

  return (
    <StaffTableClient
      staff={staff}
      pagination={pagination}
      currentPage={pagination?.currentPage || 1}
    />
  );
}
