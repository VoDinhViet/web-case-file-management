import { TemplateDetail } from "@/components/features/templates/template-detail";

interface TemplateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  const { id } = await params;

  return <TemplateDetail templateId={id} />;
}
