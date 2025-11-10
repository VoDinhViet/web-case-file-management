"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { createSource } from "@/actions/source";
import { BasicInfoCard } from "@/components/features/templates/basic-info-card";
import { TemplateGroupsForm } from "@/components/features/templates/template-groups-form";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createSourceSchema } from "@/lib/schemas/create-source-schema";
import {
  buildTemplateDefaultValues,
  mapTemplateFields,
} from "@/lib/template-utils";
import type { SelectStaffs } from "@/types";
import type { Template } from "@/types/template";
import { SourceBasicInfoFields } from "./source-basic-info-fields";

interface CreateSourceFormProps {
  template: Template;
  selectUsers: SelectStaffs[];
}

export function CreateSourceForm({
  template,
  selectUsers,
}: CreateSourceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = createSourceSchema(template);
  type FormData = z.infer<typeof schema>;

  // Generate default values for dynamic fields
  const defaultFields = buildTemplateDefaultValues(template);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      applicableLaw: "",
      userId: "",
      numberOfDefendants: 1,
      crimeType: "",
      fields: defaultFields,
    } as FormData,
  });

  async function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        const dynamicFields = mapTemplateFields(
          template,
          values.fields as Record<string, unknown>,
        );

        const payload = {
          name: values.name,
          description: values.description,
          applicableLaw: values.applicableLaw,
          userId: values.userId,
          numberOfDefendants: String(values.numberOfDefendants),
          crimeType: values.crimeType,
          fields: dynamicFields,
          templateId: template.id,
        };

        const result = await createSource(payload);

        if (result.success) {
          toast.success(result.message || "Tạo nguồn tin thành công");
          router.push("/sources");
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi tạo nguồn tin");
      }
    });
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Heading
        title="Tạo mới nguồn tin"
        description={`Tạo nguồn tin từ mẫu: ${template.title}`}
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
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Tạo nguồn tin
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
