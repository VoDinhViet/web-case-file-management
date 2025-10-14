import { getCaseList } from "@/actions/case";
import { caseSearchParamsSchema } from "@/schemas/case";
import { CasesTableClient } from "./cases-table-client";

interface CasesTableProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function CasesTable({ searchParams }: CasesTableProps) {
  const validatedParams = caseSearchParamsSchema.parse(searchParams);
  const {
    page: currentPage,
    limit: pageSize,
    q: searchQuery,
    status,
    userId,
  } = validatedParams;

  const result = await getCaseList(
    currentPage,
    pageSize,
    searchQuery,
    status,
    userId,
  );

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
      currentPage={currentPage}
    />
  );
}
