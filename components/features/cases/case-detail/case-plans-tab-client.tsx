"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { type CasePlanFormData, casePlanSchema } from "@/schemas/case-plan";

interface CasePlansTabClientProps {
  caseId: string;
  initialData: {
    investigationResult: string;
    exhibits: string[];
    nextInvestigationPurpose: string;
    nextInvestigationContent: string[];
    participatingForces: string[];
  };
}

export function CasePlansTabClient({
  caseId,
  initialData,
}: CasePlansTabClientProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CasePlanFormData>({
    resolver: zodResolver(casePlanSchema),
    defaultValues: initialData,
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

  const handleExport = async (format: "pdf" | "docx") => {
    setIsExporting(true);
    try {
      // Import action dynamically
      const { exportCaseReport } = await import("@/actions/case");

      // Call server action
      const result = await exportCaseReport(caseId, format);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Export failed");
      }

      // Create download link
      const blob = result.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ke-hoach-${caseId}-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const fileType = format === "pdf" ? "PDF" : "Word";
      toast.success(`Đã xuất file kế hoạch ${fileType}`);
    } catch (error) {
      console.error("Export error:", error);
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

  const onSubmit = async (data: CasePlanFormData) => {
    setIsSaving(true);
    try {
      const { updateCasePlan } = await import("@/actions/case");
      const result = await updateCasePlan(caseId, {
        investigationResult: data.investigationResult,
        exhibits: data.exhibits,
        nextInvestigationPurpose: data.nextInvestigationPurpose,
        nextInvestigationContent: data.nextInvestigationContent,
        participatingForces: data.participatingForces,
      });

      if (result.success) {
        toast.success(result.message || "Đã lưu kế hoạch thành công");
      } else {
        toast.error(result.error || "Không thể lưu kế hoạch");
      }
    } catch (error) {
      console.error("Save error:", error);
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
              Quản lý các kế hoạch và công việc liên quan đến vụ án
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
              <CardTitle>II. Kết quả điều tra ban đầu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sub-section 1: Về tố tụng */}
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
                        Về tố tụng
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập kết quả điều tra về tố tụng..."
                        rows={10}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập thông tin chi tiết về quá trình điều tra, các quyết
                      định, kết luận giám định...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sub-section 2: Tang vật */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 px-2.5 py-1 text-sm font-bold">
                      2
                    </div>
                    <FormLabel className="text-base font-semibold">
                      Tang vật vụ án
                    </FormLabel>
                  </div>
                  <Button
                    type="button"
                    onClick={addExhibit}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tang vật
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          name={`exhibits.${index}` as any}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea
                                  placeholder="VD: 01 (một) cái túi nilon trong suốt, kích thước (4,8x1,1)cm, bên trong chứa tinh thể màu trắng (nghi là ma túy)"
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
                      Chưa có tang vật nào
                    </p>
                    <Button
                      type="button"
                      onClick={addExhibit}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm tang vật đầu tiên
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
              <CardTitle>III. Kế hoạch điều tra tiếp theo</CardTitle>
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
                        placeholder="VD: Nhanh chóng thu thập tài liệu chứng cứ chứng minh làm rõ nội dung, diễn biến sự việc, xử lý người phạm tội đúng người, đúng tội, đúng pháp luật."
                        rows={4}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập mục đích và yêu cầu của kế hoạch điều tra tiếp theo
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          name={`nextInvestigationContent.${index}` as any}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea
                                  placeholder="VD: Hỏi cung bị can Lê Văn Tuấn"
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          name={`participatingForces.${index}` as any}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea
                                  placeholder="VD: Điều tra viên Phan Anh Dũng, Đinh Công Bình, Lê Văn Linh"
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
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
