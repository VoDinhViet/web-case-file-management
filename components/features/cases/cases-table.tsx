import { getCaseList } from "@/actions/case";
import type { CaseSearchParams } from "@/schemas/case";
import { CasesTableClient } from "./cases-table-client";

interface CasesTableProps {
  searchParams: CaseSearchParams;
}

export async function CasesTable({ searchParams }: CasesTableProps) {
  const result = await getCaseList(searchParams);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <p>{result.error || "Không thể tải danh sách vụ án"}</p>
      </div>
    );
  }

  const cases = result.data || [];
  const pagination = result.pagination || null;

  return (
    <CasesTableClient
      cases={cases}
      pagination={pagination}
      currentPage={pagination?.currentPage || 1}
    />
  );
}
