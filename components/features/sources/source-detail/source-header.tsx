import { ArrowLeft, Edit, FileText, Newspaper } from "lucide-react";
import Link from "next/link";
import { UpdateSourceStatus } from "@/components/features/sources/update-source-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Source } from "@/types";

interface SourceHeaderProps {
  sourceData: Source;
  sourceId: string;
}

export function SourceHeader({ sourceData, sourceId }: SourceHeaderProps) {
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
            <Link href="/sources">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="shadow-md" asChild>
              <Link href={`/sources/${sourceId}/edit`}>
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
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                {sourceData.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="font-mono text-xs bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm"
                >
                  <FileText className="h-3 w-3 mr-1" />#{sourceId.slice(0, 8)}
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
                  <Newspaper className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Trạng thái
                  </p>
                  <UpdateSourceStatus
                    sourceId={sourceId}
                    currentStatus={sourceData.status}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Source Type */}
            {sourceData.sourceType && (
              <div className="p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Loại nguồn tin
                    </p>
                    <p className="text-sm font-semibold truncate mt-0.5">
                      {sourceData.sourceType}
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

