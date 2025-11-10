"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateSource } from "@/actions/source";
import { BasicInfoCard } from "@/components/features/templates/basic-info-card";
import { TemplateGroupsForm } from "@/components/features/templates/template-groups-form";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createSourceSchema } from "@/lib/schemas/create-source-schema";
import type { SelectStaffs, Source } from "@/types";
import type { Template } from "@/types/template";
import { SourceBasicInfoFields } from "./source-basic-info-fields";

interface EditSourceFormProps {
  sourceData: Source;
  selectUsers: SelectStaffs[];
}

// Convert Source groups to Template structure for schema compatibility
const convertSourceToTemplate = (sourceData: Source): Template => {
  return {
    id: sourceData.templateId || "",
    title: "",
    description: "",
    groups: (sourceData.groups || []).map((group) => ({
      id: group.id,
      title: group.title,
      description: group.description,
      fields: (group.fields || []).map((field) => ({
        id: field.id,
        fieldName: `field_${field.id}`,
        fieldLabel: field.fieldLabel || "",
        fieldType: field.fieldType || "text",
        isRequired: false,
        placeholder: "",
        description: "",
      })),
    })),
  } as Template;
};

export function EditSourceForm({
  sourceData,
  selectUsers,
}: EditSourceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Convert source to template structure
  const template = convertSourceToTemplate(sourceData);

  const schema = createSourceSchema(template);
  type FormData = z.infer<typeof schema>;

  // Prepare initial field values from source data
  const defaultFields = Object.fromEntries(
    template.groups.flatMap((g) =>
      g.fields.map((f): [string, string | number | Date | null] => {
        // Find matching field value from source data
        const sourceField = sourceData.groups
          ?.flatMap((group) => group.fields || [])
          .find((field) => field.id === f.id);

        let value = sourceField?.fieldValue;

        // Convert date strings to Date objects
        if (f.fieldType === "date" && value && typeof value === "string") {
          value = new Date(value);
        }

        // Convert to appropriate type
        if (f.fieldType === "number" && value != null) {
          return [f.fieldName, Number(value)];
        }
        if (f.fieldType === "date" && value) {
          return [f.fieldName, value as Date];
        }
        return [f.fieldName, value as string | null];
      }),
    ),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: sourceData.name || "",
      description: sourceData.description || "",
      applicableLaw: sourceData.applicableLaw || "",
      userId: sourceData.userId || "",
      numberOfDefendants: Number(sourceData.numberOfDefendants) || 1,
      crimeType: sourceData.crimeType || "",
      fields: defaultFields,
    } as FormData,
  });

  async function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        // Prepare groups with updated field values matching UpdateSourceReqDto
        const updatedGroups = sourceData.groups?.map((group, groupIndex) => ({
          id: group.id,
          title: group.title,
          description: group.description,
          index: groupIndex,
          fields: group.fields?.map((field) => {
            const fieldName = `field_${field.id}`;
            const newValue = values.fields[fieldName];

            return {
              id: field.id,
              fieldLabel: field.fieldLabel,
              fieldValue: newValue != null ? String(newValue) : undefined,
            };
          }),
        }));

        const payload = {
          // Basic source fields
          name: values.name,
          description: values.description,
          applicableLaw: values.applicableLaw,
          userId: values.userId,
          numberOfDefendants: values.numberOfDefendants,
          crimeType: values.crimeType,
          // UpdateSourceReqDto structure for nested updates
          groups: updatedGroups,
        };

        const result = await updateSource(sourceData.id, payload as never);

        if (result.success) {
          toast.success(result.message || "Cập nhật nguồn tin thành công");
          router.push(`/sources/${sourceData.id}`);
          router.refresh();
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật nguồn tin");
      }
    });
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Heading
        title="Chỉnh sửa nguồn tin"
        description={`Cập nhật thông tin nguồn tin: ${sourceData.name}`}
        showBack
        onBack={handleCancel}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Card */}
          <BasicInfoCard
            title="Thông tin cơ bản"
            description="Các trường thông tin cơ bản của nguồn tin"
          >
            <SourceBasicInfoFields
              form={form as never}
              selectUsers={selectUsers}
              disabled={isPending}
            />
          </BasicInfoCard>

          {/* Dynamic fields from template */}
          <TemplateGroupsForm template={template} form={form as never} />

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
