"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { createCase } from "@/actions/case";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createCaseSchema } from "@/lib/schemas/create-case-schema";
import type { SelectStaffs } from "@/types";
import type { Template } from "@/types/template";
import { RenderFormElement } from "../templates/render-form-element";
import BasicFormInfoSection from "./basic-form-info-section";

interface CreateCaseFormProps {
  template: Template;
  promiseSelectUsers: Promise<SelectStaffs[]>;
}

// Map dynamic template fields to backend CreateCaseDto.fields
function mapDynamicFields(template: Template, fields: Record<string, unknown>) {
  return template.groups.flatMap((group) =>
    group.fields.map((f) => {
      const raw = fields[f.fieldName];
      let value: string | undefined;

      if (raw === null || raw === undefined || raw === "") {
        value = undefined;
      } else if (f.fieldType === "date" && raw instanceof Date) {
        value = raw.toISOString();
      } else {
        value = String(raw);
      }

      return {
        groupId: group.id,
        fieldLabel: f.fieldLabel,
        fieldName: f.fieldName,
        fieldType: f.fieldType,
        isEdit: false,
        isRequired: f.isRequired,
        placeholder: f.placeholder ?? "",
        defaultValue: "",
        description: f.description ?? "",
        value,
      };
    }),
  );
}

export function CreateCaseForm({
  template,
  promiseSelectUsers,
}: CreateCaseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = createCaseSchema(template);
  type FormData = z.infer<typeof schema>;

  // Generate default values for dynamic fields
  const defaultFields = Object.fromEntries(
    template.groups.flatMap((g) =>
      g.fields.map((f): [string, string | number | null] => {
        if (f.fieldType === "number") return [f.fieldName, null];
        if (f.fieldType === "date") return [f.fieldName, null];
        return [f.fieldName, ""];
      }),
    ),
  );

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
        const dynamicFields = mapDynamicFields(
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

        const result = await createCase(payload);

        if (result.success) {
          toast.success(result.message || "Tạo vụ án thành công");
          router.push("/cases");
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi tạo vụ án");
      }
    });
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Tạo mới vụ án"
        description={`Tạo vụ án từ mẫu: ${template.title}`}
        showBack
        onBack={handleCancel}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Các trường thông tin cơ bản của vụ án
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BasicFormInfoSection
                form={form as never}
                promiseSelectUsers={promiseSelectUsers}
              />
            </CardContent>
          </Card>

          {/* Dynamic fields from template */}
          {template.groups.map((group, idx) => (
            <Card key={group.id}>
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle>{group.title}</CardTitle>
                    {group.description && (
                      <CardDescription className="mt-1">
                        {group.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {group.fields.map((field) => (
                    <div
                      key={field.id}
                      className={
                        field.fieldType === "textarea" ? "md:col-span-2" : ""
                      }
                    >
                      <RenderFormElement
                        formElement={field}
                        form={form as never}
                        namePrefix="fields"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

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
                  Tạo vụ án
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
