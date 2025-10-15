import type { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import type { CreateTemplateFormData } from "@/schemas/template";
import { BasicFieldsPreview } from "./basic-fields-preview";
import { PreviewFormElement } from "./preview-form-element";

interface TemplatePreviewProps {
  form: UseFormReturn<CreateTemplateFormData>;
  groups: Array<{ id: string }>;
}

export function TemplatePreview({ form, groups }: TemplatePreviewProps) {
  return (
    <div className="flex flex-col gap-4 border-l px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        XEM TRƯỚC
        <Badge className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Tự động cập nhật
        </Badge>
      </h2>
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            {form.watch("title") || "Tiêu đề mẫu"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {form.watch("description") || "Mô tả mẫu"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Basic Fields - Reusable Component */}
          <BasicFieldsPreview />

          {/* Custom Groups from Template */}
          {groups.map((group, idx) => (
            <div
              key={group.id}
              className="space-y-3 rounded-lg border bg-muted/20 p-4"
            >
              <h4 className="font-semibold">
                {form.watch(`groups.${idx}.title`) || `Nhóm ${idx + 1}`}
              </h4>
              {form.watch(`groups.${idx}.description`) && (
                <p className="text-sm text-muted-foreground">
                  {form.watch(`groups.${idx}.description`)}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {form.watch(`groups.${idx}.fields`)?.map((field) => (
                  <PreviewFormElement
                    key={`preview-field-${field.fieldName || Math.random()}`}
                    field={field}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
