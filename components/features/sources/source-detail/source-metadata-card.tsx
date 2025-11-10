import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, FileText, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Source } from "@/types";

interface SourceMetadataCardProps {
  sourceData: Source;
  sourceId: string;
}

export function SourceMetadataCard({
  sourceData,
  sourceId,
}: SourceMetadataCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          Metadata
        </CardTitle>
        <CardDescription>Thông tin về nguồn tin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <MetadataItem
          icon={FileText}
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-950/20"
          label="Source ID"
          value={sourceId.slice(0, 8)}
          mono
        />
        <Separator />
        <MetadataItem
          icon={Clock}
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-50 dark:bg-green-950/20"
          label="Ngày tạo"
          value={format(new Date(sourceData.createdAt), "dd/MM/yyyy", {
            locale: vi,
          })}
          subtitle={format(new Date(sourceData.createdAt), "HH:mm", {
            locale: vi,
          })}
        />
        <Separator />
        <MetadataItem
          icon={RefreshCw}
          iconColor="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-50 dark:bg-orange-950/20"
          label="Cập nhật"
          value={
            sourceData.updatedAt
              ? format(new Date(sourceData.updatedAt), "dd/MM/yyyy", {
                  locale: vi,
                })
              : "-"
          }
          subtitle={
            sourceData.updatedAt
              ? format(new Date(sourceData.updatedAt), "HH:mm", {
                  locale: vi,
                })
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
}

function MetadataItem({
  icon: Icon,
  iconColor,
  bgColor,
  label,
  value,
  subtitle,
  mono = false,
}: {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  label: string;
  value: string;
  subtitle?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 group">
      <div
        className={`p-2 rounded-lg ${bgColor} ${iconColor} transition-transform group-hover:scale-110`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </p>
        {subtitle && (
          <Badge variant="secondary" className="text-xs font-normal">
            {subtitle}
          </Badge>
        )}
      </div>
    </div>
  );
}
