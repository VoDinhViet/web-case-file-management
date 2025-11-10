import { notFound } from "next/navigation";
import { getSelectStaffs } from "@/actions";
import { getSourceById } from "@/actions/source";
import { EditSourceForm } from "@/components/features/sources/edit-source-form";

export const dynamic = "force-dynamic";

interface EditSourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSourcePage({ params }: EditSourcePageProps) {
  const { id } = await params;

  const [sourceResult, selectUsers] = await Promise.all([
    getSourceById(id),
    getSelectStaffs(),
  ]);

  if (!sourceResult.success || !sourceResult.data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <EditSourceForm
        sourceData={sourceResult.data}
        selectUsers={selectUsers}
      />
    </div>
  );
}
