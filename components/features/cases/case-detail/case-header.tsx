import { ArrowLeft, Edit, FileText, Gavel, Shield } from "lucide-react";
import Link from "next/link";
import { UpdateCaseStatus } from "@/components/features/cases/update-case-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Case } from "@/types";

interface CaseHeaderProps {
  caseData: Case;
  caseId: string;
}

export function CaseHeader({ caseData, caseId }: CaseHeaderProps) {
  return (
    <div className="relative">
      <div className="relative p-6 md:p-8">
        {/* Top Section - Back button and Actions */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm"
            asChild
          >
            <Link href="/cases">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="shadow-md" asChild>
              <Link href={`/cases/${caseId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title Section */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                {caseData.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="font-mono text-xs bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm"
                >
                  <FileText className="h-3 w-3 mr-1" />#{caseId.slice(0, 8)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div className="p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Trạng thái
                  </p>
                  <UpdateCaseStatus
                    caseId={caseId}
                    currentStatus={caseData.status}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Crime Type */}
            {caseData.crimeType && (
              <div className="p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Gavel className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Loại tội phạm
                    </p>
                    <p className="text-sm font-semibold truncate mt-0.5">
                      {caseData.crimeType}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
