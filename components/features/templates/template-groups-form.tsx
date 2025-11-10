"use client";

import type { UseFormReturn } from "react-hook-form";
import { RenderFormElement } from "@/components/features/templates/render-form-element";
import { cn } from "@/lib/utils";
import type { Template } from "@/types/template";
import { BasicInfoCard } from "./basic-info-card";

interface TemplateGroupsFormProps {
  template: Template;
  form: UseFormReturn<Record<string, unknown>>;
}

export function TemplateGroupsForm({
  template,
  form,
}: TemplateGroupsFormProps) {
  return (
    <>
      {template.groups.map((group) => (
        <BasicInfoCard
          key={group.id}
          title={group.title}
          description={group.description}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "space-y-2",
                  field.fieldType === "textarea" ? "md:col-span-2" : "",
                )}
              >
                <RenderFormElement
                  formElement={field}
                  form={form as never}
                  namePrefix="fields"
                />
              </div>
            ))}
          </div>
        </BasicInfoCard>
      ))}
    </>
  );
}
