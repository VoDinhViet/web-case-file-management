import { notFound, redirect } from "next/navigation";
import { getSelectStaffs } from "@/actions";
import { getTemplateById } from "@/actions/template";
import { CreateSourceForm } from "@/components/features/sources/create-source-form";

export const dynamic = "force-dynamic";

interface CreateSourcePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CreateSourcePage({
  searchParams,
}: CreateSourcePageProps) {
  const params = await searchParams;
  const templateId = params.templateId as string | undefined;

  // Redirect to template selection if no templateId
  if (!templateId) {
    redirect("/sources/select-template");
  }

  // Fetch template and users
  const [templateResult, users] = await Promise.all([
    getTemplateById(templateId),
    getSelectStaffs(),
  ]);

  if (!templateResult.success || !templateResult.data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <CreateSourceForm
        template={templateResult.data}
        selectUsers={users}
      />
    </div>
  );
}
