import { ArrowLeft, Edit, FileText, Layers } from "lucide-react";
import Link from "next/link";
import { DeleteTemplateButton } from "@/components/features/templates/delete-template-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CaseTemplate } from "@/types";

interface TemplateHeaderProps {
  template: CaseTemplate;
  totalFields: number;
}

export function TemplateHeader({ template, totalFields }: TemplateHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/80 dark:hover:bg-slate-800/80"
              asChild
            >
              <Link href="/templates">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">
                  {template.title}
                </h1>
              </div>
              {template.description && (
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  {template.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary" className="font-normal">
                  <Layers className="h-3 w-3 mr-1" />
                  {template.groups.length} nhóm
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  <FileText className="h-3 w-3 mr-1" />
                  {totalFields} trường
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`/templates/${template.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
            </Button>
            <DeleteTemplateButton
              templateId={template.id}
              templateTitle={template.title}
              variant="destructive"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
