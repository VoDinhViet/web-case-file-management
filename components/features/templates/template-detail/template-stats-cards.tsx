import { Calendar, FileText, Hash, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CaseTemplate } from "@/types";

interface TemplateStatsCardsProps {
  template: CaseTemplate;
  totalFields: number;
}

export function TemplateStatsCards({
  template,
  totalFields,
}: TemplateStatsCardsProps) {
  const stats = [
    {
      icon: FileText,
      value: `${template.id.slice(0, 8)}...`,
      label: "Template ID",
      gradient:
        "from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20",
      border: "border-blue-200 dark:border-blue-900",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Layers,
      value: template.groups.length.toString(),
      label: "Số nhóm",
      gradient:
        "from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20",
      border: "border-purple-200 dark:border-purple-900",
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Hash,
      value: totalFields.toString(),
      label: "Tổng trường",
      gradient:
        "from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20",
      border: "border-green-200 dark:border-green-900",
      iconBg: "bg-green-500/10 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Calendar,
      value: new Date(template.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      label: "Ngày tạo",
      gradient:
        "from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20",
      border: "border-orange-200 dark:border-orange-900",
      iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`bg-gradient-to-br ${stat.gradient} ${stat.border}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
