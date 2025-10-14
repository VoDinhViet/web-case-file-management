import { notFound } from "next/navigation";
import { getTemplateById } from "@/actions/template";
import { EditTemplateForm } from "@/components/features/templates/edit-template-form";

interface EditTemplatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTemplatePage({
  params,
}: EditTemplatePageProps) {
  const { id } = await params;
  const result = await getTemplateById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa mẫu</h1>
        <p className="text-muted-foreground mt-2">
          Cập nhật thông tin và cấu trúc của mẫu form
        </p>
      </div>

      <EditTemplateForm template={result.data} />
    </div>
  );
}
