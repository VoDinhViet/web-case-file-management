import { getTemplateList } from "@/actions/template";
import type { TemplateSearchParams } from "@/schemas/template";
import TemplateTableClient from "./template-table-client";

interface TemplateTableProps {
  searchParams: TemplateSearchParams;
}

export async function TemplateTable({ searchParams }: TemplateTableProps) {
  const result = await getTemplateList(searchParams);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <p>{result.error || "Không thể tải danh sách mẫu"}</p>
      </div>
    );
  }

  const templates = result.data || [];
  const pagination = result.pagination || null;

  return (
    <TemplateTableClient
      templates={templates}
      pagination={pagination}
      currentPage={pagination?.currentPage || 1}
    />
  );
}
