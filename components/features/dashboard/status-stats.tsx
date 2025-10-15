import { AlertCircle, CheckCircle2, Clock, Pause, XCircle } from "lucide-react";
import { getCaseStats } from "@/actions";
import { cn } from "@/lib/utils";
import type { DashboardSearchParams } from "@/schemas/dashboard";
import { CaseStatusEnum } from "@/types";
import { DateFilter } from "./date-filter";
import { StaffSelect } from "./staff-select";

const statusConfig = {
  [CaseStatusEnum.PENDING]: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-l-yellow-500",
  },
  [CaseStatusEnum.IN_PROGRESS]: {
    icon: AlertCircle,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-l-blue-500",
  },
  [CaseStatusEnum.COMPLETED]: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-l-green-500",
  },
  [CaseStatusEnum.ON_HOLD]: {
    icon: Pause,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-l-orange-500",
  },
  [CaseStatusEnum.CANCELLED]: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-l-red-500",
  },
};

interface StatusStatsProps {
  validatedParams: DashboardSearchParams;
}

export async function StatusStats({ validatedParams }: StatusStatsProps) {
  const stats = await getCaseStats(validatedParams);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <StaffSelect />
        <DateFilter />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const config = statusConfig[stat.status];
          const Icon = config.icon;

          return (
            <div
              key={stat.status}
              className={cn(
                "group rounded-lg border-l-4 bg-card p-5 shadow-md transition-all hover:shadow-xl",
                config.borderColor,
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-4xl font-bold tracking-tight">
                    {stat.count}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground/80">
                    {(stat.percentage * 100).toFixed(2)}% tổng số
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    config.bgColor,
                  )}
                >
                  <Icon className={cn("size-5", config.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
