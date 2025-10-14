"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Loader2Icon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateCase } from "@/actions/case";
import { RenderFormElement } from "@/components/features/templates/render-form-element";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCaseSchema } from "@/lib/schemas/create-case-schema";
import { cn } from "@/lib/utils";
import type { SelectStaffs } from "@/types";
import type { Case } from "@/types/case";
import type { Template } from "@/types/template";

interface EditCaseFormProps {
  caseData: Case;
  selectStaffs: SelectStaffs[];
}

// Convert Case groups to Template structure for schema compatibility
const convertCaseToTemplate = (caseData: Case): Template => {
  return {
    id: caseData.templateId || "",
    title: "",
    description: "",
    groups: (caseData.groups || []).map((group) => ({
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

export function EditCaseForm({
  caseData,
  selectStaffs: selectUsers,
}: EditCaseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Convert case to template structure
  const template = convertCaseToTemplate(caseData);

  const schema = createCaseSchema(template);
  type FormData = z.infer<typeof schema>;

  // Prepare initial field values from case data
  const defaultFields = Object.fromEntries(
    template.groups.flatMap((g) =>
      g.fields.map((f): [string, string | number | Date | null] => {
        // Find matching field value from case data
        const caseField = caseData.groups
          ?.flatMap((group) => group.fields || [])
          .find((field) => field.id === f.id);

        let value = caseField?.fieldValue;

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
      name: caseData.name || "",
      description: caseData.description || "",
      applicableLaw: caseData.applicableLaw || "",
      userId: caseData.userId || "",
      numberOfDefendants: caseData.numberOfDefendants || 1,
      crimeType: caseData.crimeType || "",
      startDate: caseData.startDate ? new Date(caseData.startDate) : new Date(),
      endDate: caseData.endDate ? new Date(caseData.endDate) : null,
      fields: defaultFields,
    } as FormData,
  });

  async function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        // Prepare groups with updated field values matching UpdateCaseReqDto
        const updatedGroups = caseData.groups?.map((group, groupIndex) => ({
          id: group.id,
          title: group.title,
          description: group.description,
          index: groupIndex,
          fields: group.fields?.map((field, fieldIndex) => {
            const fieldName = `field_${field.id}`;
            const newValue = values.fields[fieldName];

            return {
              id: field.id,
              fieldLabel: field.fieldLabel,
              fieldValue: newValue != null ? String(newValue) : undefined,
              placeholder: "",
              defaultValue: "",
              description: "",
              isRequired: false,
              isEditable: true,
              index: fieldIndex,
            };
          }),
        }));

        const payload = {
          // Basic case fields (maps to casesTable columns)
          name: values.name,
          description: values.description,
          applicableLaw: values.applicableLaw,
          userId: values.userId,
          numberOfDefendants: values.numberOfDefendants,
          crimeType: values.crimeType,
          startDate: values.startDate,
          endDate: values.endDate,
          // UpdateCaseReqDto structure for nested updates
          groups: updatedGroups,
        };

        console.log("Update payload:", payload);
        const result = await updateCase(caseData.id, payload as never);

        if (result.success) {
          toast.success(result.message || "Cập nhật vụ án thành công");
          router.push(`/cases/${caseData.id}`);
          router.refresh();
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật vụ án");
      }
    });
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Chỉnh sửa vụ án"
        description={`Cập nhật thông tin vụ án: ${caseData.name}`}
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Tên vụ án */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Tên vụ án <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên vụ án"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mô tả */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả vụ án..."
                          rows={3}
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Điều luật */}
                <FormField
                  control={form.control}
                  name="applicableLaw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Điều <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: Điều 123"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cán bộ thụ lý */}
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cán bộ thụ lý <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cán bộ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Số bị can */}
                <FormField
                  control={form.control}
                  name="numberOfDefendants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số bị can <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loại tội phạm */}
                <FormField
                  control={form.control}
                  name="crimeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Loại tội phạm <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập loại tội phạm"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ngày khởi tố */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Ngày khởi tố <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isPending}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: vi,
                                  })
                                : "Chọn ngày"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            locale={vi}
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={isPending}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ngày hết hạn */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày hết hạn</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isPending}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", {
                                    locale: vi,
                                  })
                                : "Chọn ngày"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            locale={vi}
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={isPending}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
