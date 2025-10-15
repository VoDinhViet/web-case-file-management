import { notFound } from "next/navigation";
import { getTemplateById } from "@/actions/template";
import { BasicFieldsCard } from "./basic-fields-card";
import { TemplateGroupCard } from "./template-group-card";
import { TemplateHeader } from "./template-header";
import { TemplateStatsCards } from "./template-stats-cards";

interface TemplateDetailProps {
  templateId: string;
}

export async function TemplateDetail({ templateId }: TemplateDetailProps) {
  const result = await getTemplateById(templateId);

  if (!result.success || !result.data) {
    notFound();
  }

  const template = result.data;
  const totalFields = template.groups.reduce(
    (sum, group) => sum + group.fields.length,
    0,
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <TemplateHeader template={template} totalFields={totalFields} />

      {/* Template Structure */}
      <div className="space-y-6">
        {/* Basic Fields Card */}
        <BasicFieldsCard />

        {/* Custom Groups */}
        {template.groups.map((group, idx) => (
          <TemplateGroupCard key={group.id} group={group} index={idx} />
        ))}

        {/* Metadata Card - Stats Grid */}
        <TemplateStatsCards template={template} totalFields={totalFields} />
      </div>
    </div>
  );
}
