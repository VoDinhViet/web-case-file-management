"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import BasicFormInfoSection from "@/components/features/cases/basic-form-info-section";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import type { CreateTemplateFormData } from "@/schemas/template";
import type { Template } from "@/types/template";
import { RenderFormElement } from "./render-form-element";
import { SelectStaffs } from "@/types";

interface PreviewFormTemplateProps {
  formElements?: Template | CreateTemplateFormData;
  promiseSelectUsers: Promise<SelectStaffs[]>;
}

export default function PreviewFormTemplate({
  formElements,
  promiseSelectUsers,
}: PreviewFormTemplateProps) {
  const form = useForm({});

  function onSubmit(values: unknown) {
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BasicFormInfoSection
            form={form}
            promiseSelectUsers={promiseSelectUsers}
          />

          {formElements?.groups.map((group) => (
            <div key={group.index}>
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <p className="text-muted-foreground mb-2 text-sm">
                {group.description}
              </p>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.fields.map((field) => (
                  <div
                    key={field.index}
                    className={
                      field.fieldType === "textarea" ? "md:col-span-2" : ""
                    }
                  >
                    <RenderFormElement formElement={field} form={form} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4 border-t pt-6">
            <Button size={"lg"} variant="outline" type="button">
              Hủy
            </Button>
            <Button size={"lg"} type="submit">
              <Save className="h-4 w-4" />
              Tạo vụ án
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
