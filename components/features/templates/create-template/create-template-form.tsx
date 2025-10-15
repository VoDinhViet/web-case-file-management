// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTemplate } from "@/actions/template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateTemplateFormData,
  createTemplateSchema,
} from "@/schemas/template";
import { GroupCard } from "./group-card";
import { TemplatePreview } from "./template-preview";

export function CreateTemplateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTemplateFormData>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      title: "",
      description: "",
      groups: [
        {
          title: "Thông tin bổ sung",
          description: "Các trường tùy chỉnh cho mẫu này",
          index: 0,
          fields: [
            {
              fieldName: "custom_field_1",
              fieldLabel: "Trường tùy chỉnh",
              placeholder: "Nhập giá trị...",
              fieldType: "text",
              isRequired: false,
              description: "",
              index: 0,
            },
          ],
        },
      ],
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
    startTransition(async () => {
      try {
        const result = await createTemplate(values);
        if (result.success) {
          toast.success(result.message || "Tạo mẫu thành công");
          router.push("/templates");
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi tạo mẫu");
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
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Lưu mẫu form
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview - Right Side */}
      <TemplatePreview form={form} groups={groups} />
    </div>
  );
}
