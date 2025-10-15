import { notFound } from "next/navigation";
import { getSelectStaffs } from "@/actions";
import { getCaseById } from "@/actions/case";
import { EditCaseForm } from "@/components/features/cases/edit-case-form";

export const dynamic = "force-dynamic";

interface EditCasePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCasePage({ params }: EditCasePageProps) {
  const { id } = await params;

  const [caseResult, selectUsers] = await Promise.all([
    getCaseById(id),
    getSelectStaffs(),
  ]);
  console.log("caseResult", caseResult);

  if (!caseResult.success || !caseResult.data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <EditCaseForm caseData={caseResult.data} selectStaffs={selectUsers} />
    </div>
  );
}
