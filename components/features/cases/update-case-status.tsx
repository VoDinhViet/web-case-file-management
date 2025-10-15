"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateCaseStatus } from "@/actions/case";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseStatusEnum } from "@/types";

interface UpdateCaseStatusProps {
  caseId: string;
  currentStatus?: CaseStatusEnum;
  className?: string;
}

const statusOptions = [
  { value: CaseStatusEnum.PENDING, label: "Chưa xử lý" },
  { value: CaseStatusEnum.IN_PROGRESS, label: "Đang xử lý" },
  { value: CaseStatusEnum.COMPLETED, label: "Đã đóng" },
  { value: CaseStatusEnum.ON_HOLD, label: "Tạm hoãn" },
  { value: CaseStatusEnum.CANCELLED, label: "Hủy bỏ" },
];

export function UpdateCaseStatus({
  caseId,
  currentStatus,
  className,
}: UpdateCaseStatusProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const result = await updateCaseStatus(
        caseId,
        newStatus as CaseStatusEnum,
      );
      if (result.success) {
        toast.success(result.message || "Cập nhật trạng thái thành công");
        router.refresh();
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className={className}>
        {isUpdating ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Đang cập nhật...</span>
          </div>
        ) : (
          <SelectValue placeholder="Chọn trạng thái" />
        )}
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
