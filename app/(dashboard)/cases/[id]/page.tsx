import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseById } from "@/actions/case";
import { getCasePhases } from "@/actions/phase";
import { AddPhaseDialog } from "@/components/features/cases/add-phase-dialog";
import { CasePhasesTimeline } from "@/components/features/cases/case-phases-timeline";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Logic sửa: Xử lý format giá trị với validation đầy đủ
function formatFieldValue(field: {
  fieldValue?: unknown;
  fieldType?: string;
  fieldLabel?: string;
}): string {
  // Kiểm tra nếu field hoặc fieldValue null/undefined
  if (!field || field.fieldValue === null || field.fieldValue === undefined) {
    return "-";
  }

  const value = field.fieldValue;

  // Kiểm tra nếu value là chuỗi rỗng
  if (typeof value === "string" && value.trim() === "") {
    return "-";
  }

  // Xử lý theo fieldType
  if (!field.fieldType) {
    return String(value);
  }

  switch (field.fieldType) {
    case "date": {
      try {
        const dateValue = new Date(value as string);
        // Kiểm tra nếu date không hợp lệ
        if (Number.isNaN(dateValue.getTime())) {
          return String(value);
        }
        return format(dateValue, "dd/MM/yyyy", { locale: vi });
      } catch (error) {
        console.error("Error formatting date:", error);
        return String(value);
      }
    }

    case "number": {
      const numValue = Number(value);
      // Kiểm tra nếu không phải số hợp lệ
      if (Number.isNaN(numValue)) {
        return String(value);
      }
      return new Intl.NumberFormat("vi-VN").format(numValue);
    }

    case "currency": {
      const currencyValue = Number(value);
      if (Number.isNaN(currencyValue)) {
        return String(value);
      }
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(currencyValue);
    }

    case "percentage": {
      const percentValue = Number(value);
      if (Number.isNaN(percentValue)) {
        return String(value);
      }
      return `${percentValue}%`;
    }

    case "boolean": {
      if (typeof value === "boolean") {
        return value ? "Có" : "Không";
      }
      const strValue = String(value).toLowerCase();
      if (strValue === "true" || strValue === "1") return "Có";
      if (strValue === "false" || strValue === "0") return "Không";
      return String(value);
    }

    default:
      return String(value);
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;

  // Fetch case data and timeline data in parallel
  const [caseResult, phasesResult] = await Promise.all([
    getCaseById(id),
    getCasePhases(id),
  ]);

  if (!caseResult.success || !caseResult.data) {
    notFound();
  }

  const caseData = caseResult.data;
  const phases = phasesResult.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{caseData.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vụ án #{caseData.id.slice(0, 8)}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/cases/${id}/edit`}>Chỉnh sửa</Link>
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="phases">Giai đoạn</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-0">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>Thông tin cơ bản về vụ án</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Tên vụ án
                      </dt>
                      <dd className="text-sm mt-1 font-semibold">
                        {caseData.name}
                      </dd>
                    </div>
                    {caseData.applicableLaw && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Điều
                        </dt>
                        <dd className="text-sm mt-1">
                          {caseData.applicableLaw}
                        </dd>
                      </div>
                    )}
                    {caseData.crimeType && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Loại tội phạm
                        </dt>
                        <dd className="text-sm mt-1">{caseData.crimeType}</dd>
                      </div>
                    )}
                    {caseData.numberOfDefendants !== undefined && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Số bị can
                        </dt>
                        <dd className="text-sm mt-1">
                          {caseData.numberOfDefendants}
                        </dd>
                      </div>
                    )}
                    {caseData.startDate && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Ngày khởi tố
                        </dt>
                        <dd className="text-sm mt-1">
                          {format(new Date(caseData.startDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </dd>
                      </div>
                    )}
                    {caseData.endDate && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Ngày hết hạn
                        </dt>
                        <dd className="text-sm mt-1">
                          {format(new Date(caseData.endDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>
                  {caseData.description && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground mb-2">
                          Mô tả
                        </dt>
                        <dd className="text-sm whitespace-pre-wrap">
                          {caseData.description}
                        </dd>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Dynamic Groups và Fields */}
              {caseData.groups &&
                caseData.groups.length > 0 &&
                caseData.groups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <CardTitle>{group.title}</CardTitle>
                      {group.description && (
                        <CardDescription>{group.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {group.fields && group.fields.length > 0 ? (
                        <dl className="space-y-3">
                          {group.fields.map((field) => (
                            <div
                              key={field.id}
                              className="flex justify-between items-start gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                            >
                              <dt className="text-sm font-medium text-muted-foreground min-w-[120px]">
                                {field.fieldLabel || "-"}
                              </dt>
                              <dd className="text-sm font-semibold text-right flex-1">
                                {formatFieldValue(field)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Không có dữ liệu
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}

              {/* Custom Fields (fallback) */}
              {caseData.customFields &&
                Object.keys(caseData.customFields).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin bổ sung</CardTitle>
                      <CardDescription>
                        Các trường tùy chỉnh từ mẫu
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(caseData.customFields).map(
                          ([key, value]) => (
                            <div key={key}>
                              <dt className="text-sm font-medium text-muted-foreground">
                                {key}
                              </dt>
                              <dd className="text-sm mt-1">
                                {String(value || "-")}
                              </dd>
                            </div>
                          ),
                        )}
                      </dl>
                    </CardContent>
                  </Card>
                )}
            </div>

            <div className="space-y-6">
              <Card>
                {/* <CardHeader>
                  <CardTitle>Thông tin</CardTitle>
                </CardHeader> */}
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">ID</p>
                      <p className="font-mono text-xs">{caseData.id}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">Ngày tạo</p>
                      <p className="text-sm">
                        {format(
                          new Date(caseData.createdAt),
                          "dd/MM/yyyy HH:mm",
                          {
                            locale: vi,
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">
                        Cập nhật lần cuối
                      </p>
                      <p className="text-sm">
                        {caseData.updatedAt
                          ? format(
                              new Date(caseData.updatedAt),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: vi,
                              },
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-0">
          <div className="space-y-6">
            {/* Action Button */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Giai đoạn vụ án</h3>
                <p className="text-sm text-muted-foreground">
                  Theo dõi các giai đoạn và tiến độ của vụ án
                </p>
              </div>
              <AddPhaseDialog caseId={id} />
            </div>

            {/* Phases Timeline */}
            <CasePhasesTimeline caseId={id} phases={phases} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
