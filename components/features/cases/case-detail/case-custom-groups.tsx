import { Layers2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Case } from "@/types";
import { formatFieldValue } from "./format-utils";

interface CaseCustomGroupsProps {
  caseData: Case;
}

export function CaseCustomGroups({ caseData }: CaseCustomGroupsProps) {
  const hasGroups = caseData.groups && caseData.groups.length > 0;
  const hasCustomFields =
    caseData.customFields && Object.keys(caseData.customFields).length > 0;

  if (!hasGroups && !hasCustomFields) {
    return null;
  }

  return (
    <>
      {/* Dynamic Groups */}
      {hasGroups &&
        caseData.groups?.map((group, index) => {
          const colors = [
            {
              border: "border-purple-200 dark:border-purple-900",
              bg: "from-purple-50/50 dark:from-purple-950/50",
              badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
              icon: "text-purple-600 dark:text-purple-400",
            },
            {
              border: "border-blue-200 dark:border-blue-900",
              bg: "from-blue-50/50 dark:from-blue-950/50",
              badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
              icon: "text-blue-600 dark:text-blue-400",
            },
            {
              border: "border-green-200 dark:border-green-900",
              bg: "from-green-50/50 dark:from-green-950/50",
              badge: "bg-green-500/10 text-green-700 dark:text-green-300",
              icon: "text-green-600 dark:text-green-400",
            },
            {
              border: "border-orange-200 dark:border-orange-900",
              bg: "from-orange-50/50 dark:from-orange-950/50",
              badge: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
              icon: "text-orange-600 dark:text-orange-400",
            },
          ];
          const colorScheme = colors[index % colors.length];

          return (
            <Card
              key={group.id}
              className={`${colorScheme.border} overflow-hidden pt-0`}
            >
              <CardHeader
                className={`pb-4 bg-gradient-to-br ${colorScheme.bg} to-white dark:to-background border-b pt-4 !pb-2 d `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg ${colorScheme.badge} px-3 py-1.5 text-sm font-bold`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers2 className={`h-5 w-5 ${colorScheme.icon}`} />
                      {group.title}
                    </CardTitle>
                    {group.description && (
                      <CardDescription className="mt-1.5">
                        {group.description}
                      </CardDescription>
                    )}
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${colorScheme.badge} border-current`}
                    >
                      {group.fields?.length || 0} trường
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {group.fields && group.fields.length > 0 ? (
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {group.fields.map((field) => (
                      <div
                        key={field.id}
                        className="group p-3 rounded-lg border border-transparent hover:border-primary/20 hover:bg-accent/50 transition-colors"
                      >
                        <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                          {field.fieldLabel || "-"}
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {formatFieldValue(field)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Không có dữ liệu
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}

      {/* Custom Fields (fallback) */}
      {hasCustomFields && (
        <Card className="border-pink-200 dark:border-pink-900 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-br from-pink-50/50 to-white dark:to-background border-b">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
                <CardDescription className="mt-0.5">
                  Các trường tùy chỉnh từ mẫu
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(caseData.customFields || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="group p-3 rounded-lg border border-transparent hover:border-primary/20 hover:bg-accent/50 transition-colors"
                  >
                    <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      {key}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {String(value || "-")}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </>
  );
}
