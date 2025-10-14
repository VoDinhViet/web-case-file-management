import { getTemplateList } from "@/actions/template";
import { templateSearchParamsSchema } from "@/schemas/template";
import TemplateTableClient from "./template-table-client";

interface TemplateTableProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function TemplateTable({ searchParams }: TemplateTableProps) {
  const validatedParams = templateSearchParamsSchema.parse(searchParams);
  const {
    page: currentPage,
    limit: pageSize,
    q: searchQuery,
    category,
  } = validatedParams;

  const result = await getTemplateList(
    currentPage,
    pageSize,
    searchQuery,
    category,
  );

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
      currentPage={currentPage}
    />
  );
}
