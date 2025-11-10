import { ArrowLeft, FileText, Layers } from "lucide-react";
import Link from "next/link";
import { getTemplateList } from "@/actions/template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SelectTemplatePage() {
  const result = await getTemplateList({
    page: 1,
    limit: 100,
  }); // Get all templates

  if (!result.success) {
    notFound();
  }

  const templates = result.data || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sources">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Chọn mẫu nguồn tin</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Chọn một mẫu để bắt đầu tạo nguồn tin mới
          </p>
        </div>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có mẫu nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hãy tạo mẫu nguồn tin trước khi tạo nguồn tin mới
              </p>
              <Button asChild>
                <Link href="/templates/create">Tạo mẫu mới</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const totalFields = template.groups.reduce(
              (sum, group) => sum + group.fields.length,
              0,
            );

            return (
              <Link
                key={template.id}
                href={`/sources/create?templateId=${template.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {template.title}
                        </CardTitle>
                        {template.description && (
                          <CardDescription className="line-clamp-2 mt-1.5">
                            {template.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="font-normal text-xs"
                      >
                        <Layers className="h-3 w-3 mr-1" />
                        {template.groups.length} nhóm
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="font-normal text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {totalFields} trường
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        <span>Nhấn để sử dụng mẫu</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

