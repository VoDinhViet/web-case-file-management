import { SourceDetail } from "@/components/features/sources/source-detail";

export const dynamic = "force-dynamic";

interface SourceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SourceDetailPage({
  params,
}: SourceDetailPageProps) {
  const { id } = await params;

  return <SourceDetail sourceId={id} />;
}

