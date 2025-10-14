import {
  ArrowLeft,
  Calendar,
  Edit,
  FileText,
  Hash,
  Layers,
  List,
  Type,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateById } from "@/actions/template";
import { DeleteTemplateButton } from "@/components/features/templates/delete-template-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FieldType } from "@/types/template";

interface TemplateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to get field type icon
function getFieldTypeIcon(fieldType: FieldType) {
  switch (fieldType) {
    case "text":
      return FileText;
    case "number":
      return Hash;
    case "select":
      return List;
    case "date":
      return Calendar;
    case "textarea":
      return Type;
    default:
      return FileText;
  }
}

// Helper function to get field type color
function getFieldTypeColor(fieldType: FieldType) {
  switch (fieldType) {
    case "text":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950";
    case "number":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950";
    case "select":
      return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950";
    case "date":
      return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-950";
    case "textarea":
      return "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-950";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-950";
  }
}

export default async function TemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  const { id } = await params;
  const result = await getTemplateById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const template = result.data;
  const totalFields = template.groups.reduce(
    (sum, group) => sum + group.fields.length,
    0,
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 border shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-800" />
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/80 dark:hover:bg-slate-800/80"
                asChild
              >
                <Link href="/templates">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight">
                    {template.title}
                  </h1>
                </div>
                {template.description && (
                  <p className="text-muted-foreground mt-2 max-w-3xl">
                    {template.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="font-normal">
                    <Layers className="h-3 w-3 mr-1" />
                    {template.groups.length} nhóm
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    <FileText className="h-3 w-3 mr-1" />
                    {totalFields} trường
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm" asChild>
                <Link href={`/templates/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Link>
              </Button>
              <DeleteTemplateButton
                templateId={id}
                templateTitle={template.title}
                variant="destructive"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Structure */}
      <div className="space-y-6">
        {/* Basic Fields Card */}
        <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Thông tin cơ bản
                </CardTitle>
                <CardDescription className="mt-1">
                  Các trường cơ bản có sẵn trong mọi vụ án
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800">
                Mặc định
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: "case_name",
                  label: "Tên vụ án",
                  type: "text" as FieldType,
                  required: true,
                },
                { id: "law", label: "Điều", type: "text" as FieldType },
                {
                  id: "assigned_user",
                  label: "Cán bộ thụ lý",
                  type: "select" as FieldType,
                },
                {
                  id: "defendants",
                  label: "Số bị can",
                  type: "number" as FieldType,
                },
                {
                  id: "crime_type",
                  label: "Loại tội phạm",
                  type: "text" as FieldType,
                },
                {
                  id: "start_date",
                  label: "Ngày khởi tố",
                  type: "date" as FieldType,
                },
                {
                  id: "end_date",
                  label: "Ngày hết hạn",
                  type: "date" as FieldType,
                },
                {
                  id: "description",
                  label: "Mô tả vụ án",
                  type: "textarea" as FieldType,
                  span: true,
                },
              ].map((field) => {
                const Icon = getFieldTypeIcon(field.type);
                const colorClass = getFieldTypeColor(field.type);
                return (
                  <div
                    key={field.id}
                    className={`group relative p-3 rounded-lg border bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-200 ${
                      field.span ? "md:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`p-1.5 rounded ${colorClass}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-sm font-medium">{field.label}</p>
                          {field.required && (
                            <Badge
                              variant="destructive"
                              className="text-xs h-5"
                            >
                              Bắt buộc
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground ml-8">
                          {field.type.charAt(0).toUpperCase() +
                            field.type.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Groups */}
        {template.groups.map((group, idx) => (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 border-b">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground shadow-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{group.title}</CardTitle>
                  {group.description && (
                    <CardDescription className="mt-1">
                      {group.description}
                    </CardDescription>
                  )}
                  <Badge variant="outline" className="mt-2">
                    {group.fields.length} trường
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.fields.map((field) => {
                  const Icon = getFieldTypeIcon(field.fieldType);
                  const colorClass = getFieldTypeColor(field.fieldType);
                  return (
                    <div
                      key={field.id}
                      className={`group relative p-3 rounded-lg border bg-card hover:shadow-md hover:border-primary/50 transition-all duration-200 ${
                        field.fieldType === "textarea"
                          ? "md:col-span-2 lg:col-span-3"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded ${colorClass}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-sm font-medium">
                              {field.fieldLabel}
                            </p>
                            {field.isRequired && (
                              <Badge
                                variant="destructive"
                                className="text-xs h-5"
                              >
                                Bắt buộc
                              </Badge>
                            )}
                          </div>
                          <div className="ml-8 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Loại:</span>{" "}
                              {field.fieldType.charAt(0).toUpperCase() +
                                field.fieldType.slice(1)}
                            </p>
                            {field.fieldName && (
                              <p className="text-xs text-muted-foreground font-mono">
                                <span className="font-medium">Key:</span>{" "}
                                {field.fieldName}
                              </p>
                            )}
                            {field.description && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Mô tả:</span>{" "}
                                {field.description}
                              </p>
                            )}
                            {field.placeholder && (
                              <p className="text-xs text-muted-foreground italic">
                                <span className="font-medium not-italic">
                                  Placeholder:
                                </span>{" "}
                                {field.placeholder}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Metadata Card - Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {template.id.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-muted-foreground">Template ID</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                  <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{template.groups.length}</p>
                  <p className="text-xs text-muted-foreground">Số nhóm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                  <Hash className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalFields}</p>
                  <p className="text-xs text-muted-foreground">Tổng trường</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {new Date(template.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
