"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  FileText,
  Loader2Icon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateSourcePhase } from "@/actions/source-phase";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type CreatePhaseDto, createPhaseSchema } from "@/schemas/phase";
import type { SourcePhase } from "@/types/source-phase";

interface EditSourcePhaseDialogProps {
  sourceId: string;
  phase: SourcePhase;
}

export function EditSourcePhaseDialog({
  sourceId,
  phase,
}: EditSourcePhaseDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreatePhaseDto>({
    resolver: zodResolver(createPhaseSchema),
    defaultValues: {
      name: phase.name,
      order: phase.order,
      description: phase.description || "",
      startDate: new Date(phase.startDate),
      endDate: new Date(phase.endDate),
      note: phase.note || "",
      isCompleted: phase.isCompleted,
      tasks: phase.tasks?.map((task) => ({ name: task })) || [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: phase.name,
        order: phase.order,
        description: phase.description || "",
        startDate: new Date(phase.startDate),
        endDate: new Date(phase.endDate),
        note: phase.note || "",
        isCompleted: phase.isCompleted,
        tasks: phase.tasks?.map((task) => ({ name: task })) || [],
      });
    }
  }, [isOpen, phase, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  function onSubmit(values: CreatePhaseDto) {
    startTransition(async () => {
      try {
        const result = await updateSourcePhase({
          sourceId,
          phaseId: phase.id,
          rawData: values,
        });

        if (result.success) {
          toast.success(result.message || "Cập nhật giai đoạn thành công");
          setIsOpen(false);
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật giai đoạn");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa giai đoạn</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết về giai đoạn và các nhiệm vụ liên quan.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tên giai đoạn */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên giai đoạn <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Thu thập thông tin ban đầu"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên giai đoạn nên ngắn gọn, rõ ràng.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn giai đoạn"
                      {...field}
                      disabled={isPending}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thứ tự */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Thứ tự giai đoạn <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày bắt đầu & kết thúc */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Ngày bắt đầu <span className="text-red-500">*</span>
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

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Ngày kết thúc <span className="text-red-500">*</span>
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
            </div>

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ghi chú <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú cho giai đoạn..."
                      {...field}
                      disabled={isPending}
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Đánh dấu hoàn thành */}
            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Đã hoàn thành</FormLabel>
                </FormItem>
              )}
            />

            {/* Danh sách công việc */}
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Các nhiệm vụ</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "" })}
                  disabled={isPending}
                  className="h-8 shadow-sm"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Thêm
                </Button>
              </div>

              <div className="space-y-2">
                {fields.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg bg-background">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Chưa có nhiệm vụ nào
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Click "Thêm" để tạo nhiệm vụ
                    </p>
                  </div>
                ) : (
                  fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      className="flex items-start gap-2 group"
                    >
                      <div className="flex h-9 w-6 items-center justify-center text-xs font-medium text-muted-foreground">
                        {index + 1}.
                      </div>
                      <FormField
                        control={form.control}
                        name={`tasks.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Nhập tên nhiệm vụ ${index + 1}`}
                                {...field}
                                disabled={isPending}
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={isPending}
                        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật giai đoạn"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

