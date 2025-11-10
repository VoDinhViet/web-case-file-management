"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SourceStatusEnum } from "@/types";
import { updateSourceStatus } from "@/actions/source";
import { useRouter } from "next/navigation";

interface UpdateSourceStatusProps {
  sourceId: string;
  currentStatus?: SourceStatusEnum;
  className?: string;
}

const statusOptions = [
  { value: SourceStatusEnum.PENDING, label: "Chưa xử lý" },
  { value: SourceStatusEnum.IN_PROGRESS, label: "Đang xử lý" },
  { value: SourceStatusEnum.VERIFIED, label: "Đã xác minh" },
  { value: SourceStatusEnum.REJECTED, label: "Từ chối" },
  { value: SourceStatusEnum.ARCHIVED, label: "Lưu trữ" },
];

export function UpdateSourceStatus({
  sourceId,
  currentStatus,
  className,
}: UpdateSourceStatusProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<SourceStatusEnum>(
    currentStatus || SourceStatusEnum.PENDING,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const result = await updateSourceStatus(sourceId, selectedStatus);
      if (result.success) {
        toast.success(result.message || "Cập nhật trạng thái thành công");
        router.refresh();
      } else {
        toast.error(result.error || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error updating source status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={className}>
      <Select
        value={selectedStatus}
        onValueChange={(value) => setSelectedStatus(value as SourceStatusEnum)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStatus !== currentStatus && (
        <Button
          size="sm"
          onClick={handleUpdate}
          disabled={isUpdating}
          className="mt-2 w-full"
        >
          {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      )}
    </div>
  );
}

