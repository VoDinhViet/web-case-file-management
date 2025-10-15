"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaseStatusEnum } from "@/types";
import { UpdateCaseStatus } from "./update-case-status";

interface CaseStatusCellProps {
  caseId: string;
  currentStatus?: CaseStatusEnum;
}

const statusConfig: Record<
  CaseStatusEnum,
  { label: string; className: string }
> = {
  [CaseStatusEnum.PENDING]: {
    label: "Chưa xử lý",
    className:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  },
  [CaseStatusEnum.IN_PROGRESS]: {
    label: "Đang xử lý",
    className:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  [CaseStatusEnum.COMPLETED]: {
    label: "Đã đóng",
    className:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950 dark:text-green-300",
  },
  [CaseStatusEnum.ON_HOLD]: {
    label: "Tạm hoãn",
    className:
      "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-300",
  },
  [CaseStatusEnum.CANCELLED]: {
    label: "Hủy bỏ",
    className:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950 dark:text-red-300",
  },
};

export function CaseStatusCell({ caseId, currentStatus }: CaseStatusCellProps) {
  const [open, setOpen] = useState(false);
  const statusKey = currentStatus || CaseStatusEnum.PENDING;
  const status = statusConfig[statusKey];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          className={`cursor-pointer transition-colors ${status.className}`}
          variant="secondary"
        >
          {status.label}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3" align="start">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Cập nhật trạng thái
          </p>
          <UpdateCaseStatus
            caseId={caseId}
            currentStatus={currentStatus}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
