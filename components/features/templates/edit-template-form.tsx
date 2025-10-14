// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Hash,
  List,
  Loader2Icon,
  Plus,
  Save,
  Text as TextIcon,
  Trash,
  Trash2,
  Type,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateTemplate } from "@/actions/template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateTemplateFormData,
  createTemplateSchema,
} from "@/schemas/template";
import type { CaseTemplate } from "@/types";
import { PreviewFormElement } from "./preview-form-element";

const fieldTypes = [
  { value: "text", label: "Text", icon: TextIcon },
  { value: "number", label: "Number", icon: Hash },
  { value: "select", label: "Select", icon: List },
  { value: "date", label: "Date", icon: CalendarIcon },
  { value: "textarea", label: "Textarea", icon: Type },
];

interface EditTemplateFormProps {
  template: CaseTemplate;
}

export function EditTemplateForm({ template }: EditTemplateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTemplateFormData>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      title: template.title,
      description: template.description || "",
      groups: template.groups.map((group) => ({
        title: group.title,
        description: group.description || "",
        index: group.index,
        fields: group.fields.map((field) => ({
          fieldName: field.fieldName,
          fieldLabel: field.fieldLabel,
          placeholder: field.placeholder || "",
          fieldType: field.fieldType,
          isRequired: field.isRequired,
          description: field.description || "",
          index: field.index,
        })),
      })),
    },
  });

  const {
    fields: groups,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  async function onSubmit(values: CreateTemplateFormData) {
    console.log("values", values);
    startTransition(async () => {
      try {
        const result = await updateTemplate({
          templateId: template.id,
          rawData: values,
        });
        if (result.success) {
          toast.success(result.message || "Cập nhật mẫu thành công");
          router.push("/templates");
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật mẫu");
      }
    });
  }

  const addGroup = () => {
    appendGroup({
      title: `Nhóm ${groups.length + 1}`,
      description: "",
      index: groups.length,
      fields: [
        {
          fieldName: `field_${Date.now()}`,
          fieldLabel: "Trường mới",
          placeholder: "",
          fieldType: "text",
          isRequired: false,
          description: "",
          index: 0,
        },
      ],
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Form Builder - Left Side */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Template Info */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100">
                      Tiêu đề <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Form đăng ký thành viên"
                        {...field}
                        disabled={isPending}
                        className="border-slate-200 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100">
                      Mô tả
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn gọn về mục đích của form này..."
                        className="resize-none min-h-[100px] border-slate-200 focus:border-blue-500"
                        {...field}
                        disabled={isPending}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Groups Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Nhóm Trường Tùy Chỉnh
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Thêm các trường bổ sung ngoài thông tin cơ bản
                  </p>
                </div>
                <Badge className="bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {groups.length} nhóm
                </Badge>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Lưu ý:</strong> Các trường cơ bản (Tên vụ án, Điều,
                  Cán bộ thụ lý, v.v.) sẽ tự động có sẵn trong mọi vụ án. Bạn
                  chỉ cần thêm các trường tùy chỉnh riêng cho mẫu này.
                </p>
              </div>

              {/* Empty State */}
              {groups.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                    Chưa có nhóm nào
                  </p>
                </div>
              )}

              {/* Groups */}
              <div className="space-y-4">
                {groups.map((group, groupIndex) => (
                  <GroupCard
                    key={group.id}
                    groupIndex={groupIndex}
                    form={form}
                    onRemove={() => removeGroup(groupIndex)}
                    disabled={isPending}
                    canRemove={groups.length > 1}
                    totalGroups={groups.length}
                  />
                ))}
              </div>

              {/* Add Group Button */}
              <Button
                onClick={addGroup}
                variant="outline"
                size="lg"
                type="button"
                className="h-12 w-full border-2 border-dashed border-slate-300 bg-transparent transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                disabled={isPending}
              >
                <Plus className="mr-2 h-5 w-5" />
                Thêm nhóm mới
              </Button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={isPending}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="flex-1 text-white shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Cập nhật mẫu form
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview - Right Side */}
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
            {/* Hardcoded Basic Fields - Always visible */}
            <div className="space-y-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 p-4">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Thông tin cơ bản</h4>
                <Badge variant="secondary" className="text-xs">
                  Mặc định
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Cung cấp thông tin chung về vụ án
              </p>
              <div className="space-y-2">
                {/* Basic fields preview */}
                <div className="space-y-1">
                  <label htmlFor="preview-name" className="text-sm font-medium">
                    Tên vụ án <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    id="preview-name"
                    placeholder="Nhập tên vụ án"
                    disabled
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập tên vụ án
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="preview-law"
                      className="text-sm font-medium"
                    >
                      Điều
                    </label>
                    <Input
                      id="preview-law"
                      placeholder="Nhập điều"
                      disabled
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="preview-user"
                      className="text-sm font-medium"
                    >
                      Cán bộ thụ lý
                    </label>
                    <Input
                      id="preview-user"
                      placeholder="Chọn người thụ lý"
                      disabled
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="preview-defendants"
                      className="text-sm font-medium"
                    >
                      Số bị can
                    </label>
                    <Input
                      id="preview-defendants"
                      type="number"
                      placeholder="0"
                      disabled
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="preview-crime"
                      className="text-sm font-medium"
                    >
                      Loại tội phạm
                    </label>
                    <Input
                      id="preview-crime"
                      placeholder="VD: GH Lần 2..."
                      disabled
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="preview-start"
                      className="text-sm font-medium"
                    >
                      Ngày khởi tố
                    </label>
                    <Input
                      id="preview-start"
                      type="date"
                      disabled
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="preview-end"
                      className="text-sm font-medium"
                    >
                      Ngày hết hạn
                    </label>
                    <Input
                      id="preview-end"
                      type="date"
                      disabled
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="preview-desc" className="text-sm font-medium">
                    Mô tả vụ án
                  </label>
                  <Textarea
                    id="preview-desc"
                    placeholder="Nhập mô tả vụ án"
                    disabled
                    className="bg-background"
                    rows={3}
                  />
                </div>
              </div>
            </div>

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
    </div>
  );
}

// Group Card Component
function GroupCard({
  groupIndex,
  form,
  onRemove,
  disabled,
  canRemove,
  totalGroups,
}: {
  groupIndex: number;
  form: ReturnType<typeof useForm<CreateTemplateFormData>>;
  onRemove: () => void;
  disabled: boolean;
  canRemove: boolean;
  totalGroups: number;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: `groups.${groupIndex}.fields`,
  });

  const addField = () => {
    append({
      fieldName: `field_${Date.now()}`,
      fieldLabel: "Trường mới",
      placeholder: "",
      fieldType: "text",
      isRequired: false,
      description: "",
      index: fields.length,
    });
  };

  const moveGroupUp = () => {
    if (groupIndex > 0) {
      const groups = form.getValues("groups");
      const temp = groups[groupIndex];
      groups[groupIndex] = groups[groupIndex - 1];
      groups[groupIndex - 1] = temp;
      form.setValue("groups", groups);
    }
  };

  const moveGroupDown = () => {
    if (groupIndex < totalGroups - 1) {
      const groups = form.getValues("groups");
      const temp = groups[groupIndex];
      groups[groupIndex] = groups[groupIndex + 1];
      groups[groupIndex + 1] = temp;
      form.setValue("groups", groups);
    }
  };

  return (
    <Card className="relative overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 h-full w-1 bg-primary" />

      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          {/* Group number */}
          <div className="mt-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
              {groupIndex + 1}
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 space-y-3">
            <FormField
              control={form.control}
              name={`groups.${groupIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 dark:text-slate-100">
                    Tiêu đề nhóm
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Thông tin đương sự"
                      {...field}
                      disabled={disabled}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`groups.${groupIndex}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 dark:text-slate-100">
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về nhóm này..."
                      {...field}
                      disabled={disabled}
                      rows={2}
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {groupIndex > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={moveGroupUp}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            {groupIndex < totalGroups - 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={moveGroupDown}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content - Fields */}
      <CardContent className="space-y-3 pt-4">
        {/* Empty state */}
        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              Nhóm này chưa có trường nào
            </p>
          </div>
        )}

        {/* Fields */}
        {fields.map((field, fieldIndex) => (
          <FieldCard
            key={field.id}
            groupIndex={groupIndex}
            fieldIndex={fieldIndex}
            form={form}
            onRemove={() => remove(fieldIndex)}
            onMoveUp={() => {
              if (fieldIndex > 0) {
                move(fieldIndex, fieldIndex - 1);
              }
            }}
            onMoveDown={() => {
              if (fieldIndex < fields.length - 1) {
                move(fieldIndex, fieldIndex + 1);
              }
            }}
            disabled={disabled}
            canRemove={fields.length > 1}
            totalFields={fields.length}
          />
        ))}

        {/* Add field button */}
        <Button
          onClick={addField}
          variant="outline"
          size="sm"
          type="button"
          className="h-10 w-full border-dashed border-slate-300 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
          disabled={disabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm trường
        </Button>
      </CardContent>
    </Card>
  );
}

// Field Card Component
function FieldCard({
  groupIndex,
  fieldIndex,
  form,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled,
  canRemove,
  totalFields,
}: {
  groupIndex: number;
  fieldIndex: number;
  form: ReturnType<typeof useForm<CreateTemplateFormData>>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled: boolean;
  canRemove: boolean;
  totalFields: number;
}) {
  const fieldType = form.watch(
    `groups.${groupIndex}.fields.${fieldIndex}.fieldType`,
  );
  const currentFieldType = fieldTypes.find((t) => t.value === fieldType);
  const FieldIcon = currentFieldType?.icon || Type;

  return (
    <div className="rounded-lg border p-4 bg-background">
      <div className="flex items-start gap-3">
        {/* Field icon */}
        <div className="mt-2 flex-shrink-0">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700 dark:bg-slate-800">
            <FieldIcon className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        {/* Field content */}
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.fieldLabel`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                    Tên hiển thị
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Họ tên"
                      {...field}
                      disabled={disabled}
                      className="h-9 border-slate-200"
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate fieldName
                        const fieldName = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "_")
                          .replace(/[^a-z0-9_]/g, "");
                        form.setValue(
                          `groups.${groupIndex}.fields.${fieldIndex}.fieldName`,
                          fieldName,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.fieldName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                    Tên kỹ thuật
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: full_name"
                      {...field}
                      disabled={disabled}
                      className="h-9 border-slate-200 font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`groups.${groupIndex}.fields.${fieldIndex}.placeholder`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Placeholder (văn bản gợi ý)"
                    {...field}
                    disabled={disabled}
                    className="border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`groups.${groupIndex}.fields.${fieldIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Mô tả (gợi ý cho người điền)"
                    {...field}
                    disabled={disabled}
                    className="border-slate-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center gap-4">
            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.fieldType`}
              render={({ field }) => (
                <FormItem className="max-w-[200px] flex-1">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại trường" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Loại trường</SelectLabel>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4 text-slate-600" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`groups.${groupIndex}.fields.${fieldIndex}.isRequired`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Bắt buộc
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Delete & Move buttons */}
        <div className="ml-2 flex flex-col items-center gap-1">
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
              className="mt-2 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          {fieldIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={disabled}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {fieldIndex < totalFields - 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={disabled}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
