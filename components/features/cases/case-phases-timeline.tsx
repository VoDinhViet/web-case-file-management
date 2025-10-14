"use client";

import { CheckCircle, Clock, FileText, Trash2 } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { deletePhase, togglePhaseCompletion } from "@/actions/phase";
import { EditPhaseDialog } from "@/components/features/cases/edit-phase-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getPhaseStatus } from "@/lib/utils/phase-utils";
import type { Phase } from "@/types/phase";

interface PhaseItemProps {
  phase: Phase;
  caseId: string;
}

function PhaseItem({ phase, caseId }: PhaseItemProps) {
  const {
    id,
    name,
    description,
    order,
    startDate,
    endDate,
    isCompleted,
    tasks,
    note,
  } = phase;

  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    icon: StatusIcon,
    iconClass,
    dotClass,
  } = getPhaseStatus({
    isCompleted,
    endDate,
  });

  const handleToggle = useCallback(() => {
    startTransition(async () => {
      const result = await togglePhaseCompletion({
        phaseId: id,
        isCompleted: !isCompleted,
      });
      if (result.success) {
        toast.success(`Giai đoạn ${order} đã được cập nhật.`);
      } else {
        toast.error(result.error || "Không thể cập nhật trạng thái");
      }
    });
  }, [id, isCompleted, order]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePhase({
        caseId,
        phaseId: id,
      });

      if (result.success) {
        toast.success(result.message || "Đã xóa giai đoạn thành công");
        setShowDeleteDialog(false);
        window.location.reload();
      } else {
        toast.error(result.error || "Không thể xóa giai đoạn");
      }
    } catch (error) {
      console.error("Error deleting phase:", error);
      toast.error("Đã xảy ra lỗi khi xóa giai đoạn");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex w-full items-start gap-6">
        {/* Status Indicator */}
        <div
          className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-4 border-background shadow-lg transition-all duration-200 ${dotClass}`}
        >
          <StatusIcon className={`h-7 w-7 ${iconClass}`} />
        </div>

        {/* Phase Card */}
        <Card className="w-full transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {order}
                  </div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                </div>
                {description && (
                  <CardDescription className="text-sm">
                    {description}
                  </CardDescription>
                )}
              </div>

              <CardAction className="flex items-center gap-1">
                <Button
                  onClick={handleToggle}
                  size="icon"
                  variant="ghost"
                  className={`h-9 w-9 transition-colors ${
                    isCompleted
                      ? "hover:bg-green-100 dark:hover:bg-green-950"
                      : "hover:bg-muted"
                  }`}
                  title={isCompleted ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
                  disabled={isPending}
                >
                  <CheckCircle
                    className={`h-5 w-5 transition-colors ${
                      isCompleted
                        ? "text-green-600 fill-green-100"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
                <EditPhaseDialog caseId={caseId} phase={phase} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Dates */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Bắt đầu", date: startDate, color: "blue" },
                { label: "Kết thúc", date: endDate, color: "orange" },
              ].map(({ label, date, color }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ${
                    color === "blue"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                      : "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
                  }`}
                >
                  <span className="text-xs opacity-80">{label}:</span>
                  <span className="font-semibold">{formatDate(date)}</span>
                </div>
              ))}
            </div>

            {/* Completed Badge */}
            {isCompleted && (
              <div className="flex items-center gap-2 rounded-lg border-2 border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 px-4 py-3 shadow-sm dark:border-green-800 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-950/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  ✓ Hoàn thành vào {formatDate(new Date().toISOString())}
                </span>
              </div>
            )}

            {/* Tasks Section */}
            {!!tasks?.length && (
              <div className="space-y-3 rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h5 className="text-sm font-semibold">
                    Công việc cần thực hiện ({tasks.length})
                  </h5>
                </div>
                <ul className="space-y-2.5 pl-1">
                  {tasks.map((task) => (
                    <li
                      key={`${id}-task-${task}`}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span className="text-foreground/90">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes Section */}
            {note && (
              <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm dark:border-primary/30 dark:bg-primary/10">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Ghi chú
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {note}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa giai đoạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giai đoạn &quot;
              <span className="font-semibold text-foreground">{name}</span>
              &quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            >
              {isDeleting ? "Đang xóa..." : "Xóa giai đoạn"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface CasePhasesTimelineProps {
  caseId: string;
  phases: Phase[];
}

export function CasePhasesTimeline({
  caseId,
  phases,
}: CasePhasesTimelineProps) {
  if (phases.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-muted/50 p-4">
                <Clock className="h-10 w-10 opacity-50" />
              </div>
            </div>
            <p className="text-sm font-medium mb-1">Chưa có giai đoạn nào</p>
            <p className="text-xs">Thêm giai đoạn để theo dõi tiến độ vụ án</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort phases by order
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order);

  return (
    <div className="relative space-y-8">
      {/* Timeline connector line */}
      <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-gradient-to-b from-border via-border/50 to-transparent" />

      {sortedPhases.map((phase, index) => (
        <div key={phase.id} className="relative">
          <PhaseItem phase={phase} caseId={caseId} />

          {/* Connector dot between phases */}
          {index < sortedPhases.length - 1 && (
            <div className="absolute left-7 -bottom-4 h-2 w-2 -translate-x-[3px] rounded-full bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
