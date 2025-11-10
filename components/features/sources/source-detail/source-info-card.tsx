import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  FileText,
  Gavel,
  Newspaper,
  Scale,
  Tag,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Source } from "@/types";

interface SourceInfoCardProps {
  sourceData: Source;
}

const fieldIcons = {
  name: { icon: FileText, color: "text-blue-600 dark:text-blue-400" },
  law: { icon: Scale, color: "text-purple-600 dark:text-purple-400" },
  crimeType: { icon: Gavel, color: "text-red-600 dark:text-red-400" },
  sourceType: { icon: Tag, color: "text-orange-600 dark:text-orange-400" },
  defendants: { icon: Users, color: "text-amber-600 dark:text-amber-400" },
  createdAt: { icon: Calendar, color: "text-green-600 dark:text-green-400" },
  updatedAt: { icon: Calendar, color: "text-pink-600 dark:text-pink-400" },
  content: { icon: Newspaper, color: "text-sky-600 dark:text-sky-400" },
};

export function SourceInfoCard({ sourceData }: SourceInfoCardProps) {
  return (
    <Card>
      <CardHeader className="border-">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Thông tin chi tiết
        </CardTitle>
        <CardDescription>Thông tin cơ bản về nguồn tin</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <InfoItemWithIcon
            icon={fieldIcons.name.icon}
            iconColor={fieldIcons.name.color}
            label="Tên nguồn tin"
            value={sourceData.name}
            highlight
          />

          {sourceData.applicableLaw && (
            <InfoItemWithIcon
              icon={fieldIcons.law.icon}
              iconColor={fieldIcons.law.color}
              label="Điều"
              value={sourceData.applicableLaw}
            />
          )}

          {sourceData.crimeType && (
            <InfoItemWithIcon
              icon={fieldIcons.crimeType.icon}
              iconColor={fieldIcons.crimeType.color}
              label="Loại tội phạm"
              value={sourceData.crimeType}
            />
          )}

          {sourceData.sourceType && (
            <InfoItemWithIcon
              icon={fieldIcons.sourceType.icon}
              iconColor={fieldIcons.sourceType.color}
              label="Loại nguồn tin"
              value={sourceData.sourceType}
            />
          )}

          {sourceData.numberOfDefendants !== undefined && (
            <InfoItemWithIcon
              icon={fieldIcons.defendants.icon}
              iconColor={fieldIcons.defendants.color}
              label="Số đối tượng liên quan"
              value={sourceData.numberOfDefendants?.toString() ?? "0"}
            />
          )}

          {sourceData.createdAt && (
            <InfoItemWithIcon
              icon={fieldIcons.createdAt.icon}
              iconColor={fieldIcons.createdAt.color}
              label="Ngày tạo"
              value={format(new Date(sourceData.createdAt), "dd/MM/yyyy", {
                locale: vi,
              })}
            />
          )}

          {sourceData.updatedAt && (
            <InfoItemWithIcon
              icon={fieldIcons.updatedAt.icon}
              iconColor={fieldIcons.updatedAt.color}
              label="Cập nhật lần cuối"
              value={format(new Date(sourceData.updatedAt), "dd/MM/yyyy", {
                locale: vi,
              })}
            />
          )}

          {sourceData.content && (
            <InfoItemWithIcon
              icon={fieldIcons.content.icon}
              iconColor={fieldIcons.content.color}
              label="Nội dung"
              value={sourceData.content}
            />
          )}
        </dl>

        {sourceData.description && (
          <>
            <Separator className="my-6" />
            <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-900/50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <dt className="text-sm font-semibold text-foreground">Mô tả</dt>
              </div>
              <dd className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pl-6">
                {sourceData.description}
              </dd>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoItemWithIcon({
  icon: Icon,
  iconColor,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </dt>
        <dd
          className={`text-sm ${highlight ? "font-semibold text-foreground" : "text-foreground/90"}`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
