import { getStaffList } from "@/actions";
import { staffSearchParamsSchema } from "@/schemas/staff";
import StaffTableClient from "./staff-table-client";

interface StaffTableProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function StaffTable({ searchParams }: StaffTableProps) {
  const validatedParams = staffSearchParamsSchema.parse(searchParams);
  const {
    page: currentPage,
    limit: pageSize,
    q: searchQuery,
  } = validatedParams;

  const result = await getStaffList(currentPage, pageSize, searchQuery);

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
      currentPage={currentPage}
    />
  );
}
