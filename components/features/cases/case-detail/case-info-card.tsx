import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, FileText, Gavel, Scale, Shield, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Case } from "@/types";

interface CaseInfoCardProps {
  caseData: Case;
}

const fieldIcons = {
  name: { icon: FileText, color: "text-blue-600 dark:text-blue-400" },
  law: { icon: Scale, color: "text-purple-600 dark:text-purple-400" },
  crimeType: { icon: Gavel, color: "text-red-600 dark:text-red-400" },
  defendants: { icon: Users, color: "text-orange-600 dark:text-orange-400" },
  startDate: { icon: Calendar, color: "text-green-600 dark:text-green-400" },
  endDate: { icon: Calendar, color: "text-pink-600 dark:text-pink-400" },
};

export function CaseInfoCard({ caseData }: CaseInfoCardProps) {
  return (
    <Card>
      <CardHeader className="border-">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Thông tin chi tiết
        </CardTitle>
        <CardDescription>Thông tin cơ bản về vụ án</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <InfoItemWithIcon
            icon={fieldIcons.name.icon}
            iconColor={fieldIcons.name.color}
            label="Tên vụ án"
            value={caseData.name}
            highlight
          />

          {caseData.applicableLaw && (
            <InfoItemWithIcon
              icon={fieldIcons.law.icon}
              iconColor={fieldIcons.law.color}
              label="Điều"
              value={caseData.applicableLaw}
            />
          )}

          {caseData.crimeType && (
            <InfoItemWithIcon
              icon={fieldIcons.crimeType.icon}
              iconColor={fieldIcons.crimeType.color}
              label="Loại tội phạm"
              value={caseData.crimeType}
            />
          )}

          {caseData.numberOfDefendants !== undefined && (
            <InfoItemWithIcon
              icon={fieldIcons.defendants.icon}
              iconColor={fieldIcons.defendants.color}
              label="Số bị can"
              value={caseData.numberOfDefendants.toString()}
            />
          )}

          {caseData.startDate && (
            <InfoItemWithIcon
              icon={fieldIcons.startDate.icon}
              iconColor={fieldIcons.startDate.color}
              label="Ngày khởi tố"
              value={format(new Date(caseData.startDate), "dd/MM/yyyy", {
                locale: vi,
              })}
            />
          )}

          {caseData.endDate && (
            <InfoItemWithIcon
              icon={fieldIcons.endDate.icon}
              iconColor={fieldIcons.endDate.color}
              label="Ngày hết hạn"
              value={format(new Date(caseData.endDate), "dd/MM/yyyy", {
                locale: vi,
              })}
            />
          )}
        </dl>

        {caseData.description && (
          <>
            <Separator className="my-6" />
            <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-900/50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <dt className="text-sm font-semibold text-foreground">Mô tả</dt>
              </div>
              <dd className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pl-6">
                {caseData.description}
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
