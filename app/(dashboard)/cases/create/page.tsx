import { notFound, redirect } from "next/navigation";
import { getTemplateById } from "@/actions/template";
import { CreateCaseForm } from "@/components/features/cases/create-case-form";
import { getSelectStaffs } from "@/actions";

interface CreateCasePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CreateCasePage({
  searchParams,
}: CreateCasePageProps) {
  const params = await searchParams;
  const templateId = params.templateId as string | undefined;

  // Redirect to template selection if no templateId
  if (!templateId) {
    redirect("/cases/select-template");
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
      <CreateCaseForm
        template={templateResult.data}
        promiseSelectUsers={Promise.resolve(users)}
      />
    </div>
  );
}
