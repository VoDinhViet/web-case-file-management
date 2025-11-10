import { getSourceList } from "@/actions/source";
import type { SourceSearchParams } from "@/schemas/source";
import { SourcesTableClient } from "./sources-table-client";

interface SourcesTableProps {
  searchParams: SourceSearchParams;
}

export async function SourcesTable({ searchParams }: SourcesTableProps) {
  const result = await getSourceList(searchParams);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <p>{result.error || "Không thể tải danh sách nguồn tin"}</p>
      </div>
    );
  }

  const sources = result.data || [];
  const pagination = result.pagination || null;

  return (
    <SourcesTableClient
      sources={sources}
      pagination={pagination}
      currentPage={pagination?.currentPage || 1}
    />
  );
}

