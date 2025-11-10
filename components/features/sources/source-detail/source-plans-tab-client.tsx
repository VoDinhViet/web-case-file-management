"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Download, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type SourcePlanFormData,
  sourcePlanSchema,
} from "@/schemas/source-plan";

type SourcePlanArrayFieldName =
  | `exhibits.${number}`
  | `nextInvestigationContent.${number}`
  | `participatingForces.${number}`;

interface SourcePlansTabClientProps {
  sourceId: string;
  initialData: {
    investigationResult: string;
    exhibits: string[];
    nextInvestigationPurpose: string;
    nextInvestigationContent: string[];
    participatingForces: string[];
    startDate?: Date | string;
    endDate?: Date | string;
    budget: string;
  };
}

export function SourcePlansTabClient({
  sourceId,
  initialData,
}: SourcePlansTabClientProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SourcePlanFormData>({
    resolver: zodResolver(sourcePlanSchema),
    defaultValues: {
      ...initialData,
      budget: initialData.budget || "",
      startDate: initialData.startDate
        ? typeof initialData.startDate === "string"
          ? new Date(initialData.startDate)
          : initialData.startDate
        : undefined,
      endDate: initialData.endDate
        ? typeof initialData.endDate === "string"
          ? new Date(initialData.endDate)
          : initialData.endDate
        : undefined,
    },
  });

  const {
    fields: exhibitFields,
    append: appendExhibit,
    remove: removeExhibit,
  } = useFieldArray({
    control: form.control,
    name: "exhibits" as never,
  });

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
  } = useFieldArray({
    control: form.control,
    name: "nextInvestigationContent" as never,
  });

  const {
    fields: forceFields,
    append: appendForce,
    remove: removeForce,
  } = useFieldArray({
    control: form.control,
    name: "participatingForces" as never,
  });

  const handleExport = async (formatType: "pdf" | "docx") => {
    setIsExporting(true);
    try {
      const { exportSourceReport } = await import("@/actions/source");

      const result = await exportSourceReport(sourceId, formatType);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Export failed");
      }

      const blob = result.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ke-hoach-nguon-tin-${sourceId}-${Date.now()}.${formatType}`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const fileType = formatType === "pdf" ? "PDF" : "Word";
      toast.success(`Đã xuất file kế hoạch ${fileType}`);
    } catch (error) {
      console.error("Export source plan error:", error);
      toast.error("Không thể xuất file");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = () => handleExport("docx");

  const addExhibit = () => {
    appendExhibit("");
  };

  const addContent = () => {
    appendContent("");
  };

  const addForce = () => {
    appendForce("");
  };

  const onSubmit = async (data: SourcePlanFormData) => {
    setIsSaving(true);
    try {
      const { updateSourcePlan } = await import("@/actions/source");
      const result = await updateSourcePlan(sourceId, {
        investigationResult: data.investigationResult,
        exhibits: data.exhibits,
        nextInvestigationPurpose: data.nextInvestigationPurpose,
        nextInvestigationContent: data.nextInvestigationContent,
        participatingForces: data.participatingForces,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
      });

      if (result.success) {
        toast.success(result.message || "Đã lưu kế hoạch nguồn tin thành công");
      } else {
        toast.error(result.error || "Không thể lưu kế hoạch");
      }
    } catch (error) {
      console.error("Save source plan error:", error);
      toast.error("Không thể lưu kế hoạch");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Kế hoạch</h3>
            <p className="text-sm text-muted-foreground">
              Quản lý các kế hoạch và công việc liên quan đến nguồn tin
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isExporting}
              onClick={handleExportWord}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Đang xuất..." : "Xuất Word"}
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu kế hoạch"}
            </Button>
          </div>
        </div>

        {/* Main Card: Investigation Result */}
        <div className="max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>II. Kết quả xác minh ban đầu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sub-section 1: Investigation Result */}
              <FormField
                control={form.control}
                name="investigationResult"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2.5 py-1 text-sm font-bold">
                        1
                      </div>
                      <FormLabel className="text-base font-semibold">
                        Thông tin thu thập được
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin thu thập được..."
                        rows={10}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập thông tin chi tiết về kết quả xác minh ban đầu.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sub-section 2: Exhibits */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 px-2.5 py-1 text-sm font-bold">
                      2
                    </div>
                    <FormLabel className="text-base font-semibold">
                      Tài liệu, vật chứng
                    </FormLabel>
                  </div>
                  <Button
                    type="button"
                    onClick={addExhibit}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm mục
                  </Button>
                </div>

                {exhibitFields.length > 0 ? (
                  <div className="space-y-3">
                    {exhibitFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 pt-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                        </div>
                        <FormField
                          control={form.control}
                          name={`exhibits.${index}` as SourcePlanArrayFieldName}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea
                                  placeholder="Nhập mô tả tài liệu, vật chứng..."
                                  rows={3}
                                  className="resize-none"
                                  {...field}
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
                          className="flex-shrink-0 h-9 w-9 mt-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeExhibit(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Chưa có mục nào
                    </p>
                    <Button
                      type="button"
                      onClick={addExhibit}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm mục đầu tiên
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section III: Next Investigation Plan */}
        <div className="max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>III. Kế hoạch xử lý tiếp theo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sub-section 1: Purpose */}
              <FormField
                control={form.control}
                name="nextInvestigationPurpose"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-1 text-sm font-bold">
                        1
                      </div>
                      <FormLabel className="text-base font-semibold">
                        Mục đích yêu cầu
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mục đích và yêu cầu xử lý tiếp theo..."
                        rows={4}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập mục đích và yêu cầu của kế hoạch xử lý tiếp theo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sub-section 2: Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 px-2.5 py-1 text-sm font-bold">
                      2
                    </div>
                    <FormLabel className="text-base font-semibold">
                      Nội dung thực hiện
                    </FormLabel>
                  </div>
                  <Button
                    type="button"
                    onClick={addContent}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm nội dung
                  </Button>
                </div>

                {contentFields.length > 0 ? (
                  <div className="space-y-3">
                    {contentFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 pt-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                        </div>
                        <FormField
                          control={form.control}
                          name={
                            `nextInvestigationContent.${index}` as SourcePlanArrayFieldName
                          }
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea
                                  placeholder="Nhập nội dung cần thực hiện..."
                                  rows={2}
                                  className="resize-none"
                                  {...field}
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
                          className="flex-shrink-0 h-9 w-9 mt-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeContent(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Chưa có nội dung nào
                    </p>
                    <Button
                      type="button"
                      onClick={addContent}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm nội dung đầu tiên
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section IV: Implementation Organization */}
        <div className="max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>IV. Tổ chức thực hiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sub-section 1: Participating Forces */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 text-sm font-bold">
                      1
                    </div>
                    <FormLabel className="text-base font-semibold">
                      Lực lượng tham gia
                    </FormLabel>
                  </div>
                  <Button
                    type="button"
                    onClick={addForce}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm lực lượng
                  </Button>
                </div>

                {forceFields.length > 0 ? (
                  <div className="space-y-3">
                    {forceFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 pt-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                        </div>
                        <FormField
                          control={form.control}
                          name={
                            `participatingForces.${index}` as SourcePlanArrayFieldName
                          }
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea
                                  placeholder="Nhập lực lượng tham gia..."
                                  rows={2}
                                  className="resize-none"
                                  {...field}
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
                          className="flex-shrink-0 h-9 w-9 mt-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeForce(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Chưa có lực lượng nào
                    </p>
                    <Button
                      type="button"
                      onClick={addForce}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm lực lượng đầu tiên
                    </Button>
                  </div>
                )}
              </div>

              {/* Sub-section 2: Time Period */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-1 text-sm font-bold">
                    2
                  </div>
                  <FormLabel className="text-base font-semibold">
                    Thời gian thực hiện
                  </FormLabel>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày bắt đầu</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              locale={vi}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
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
                      <FormItem>
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày kết thúc</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              locale={vi}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section V: Budget and Resources */}
        <div className="max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>V. Phương tiện, kinh phí</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nguồn kinh phí và phương tiện
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin về nguồn kinh phí và phương tiện..."
                        rows={6}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập thông tin về nguồn kinh phí và phương tiện sử dụng
                      cho kế hoạch xử lý nguồn tin.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
