"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SourceStatusEnum } from "@/types";
import { UpdateSourceStatus } from "./update-source-status";

interface SourceStatusCellProps {
  sourceId: string;
  currentStatus?: SourceStatusEnum;
}

const statusConfig: Record<
  SourceStatusEnum,
  { label: string; className: string }
> = {
  [SourceStatusEnum.PENDING]: {
    label: "Chưa xử lý",
    className:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  },
  [SourceStatusEnum.IN_PROGRESS]: {
    label: "Đang xử lý",
    className:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  [SourceStatusEnum.VERIFIED]: {
    label: "Đã xác minh",
    className:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950 dark:text-green-300",
  },
  [SourceStatusEnum.REJECTED]: {
    label: "Từ chối",
    className:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950 dark:text-red-300",
  },
  [SourceStatusEnum.ARCHIVED]: {
    label: "Lưu trữ",
    className:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-950 dark:text-gray-300",
  },
};

export function SourceStatusCell({
  sourceId,
  currentStatus,
}: SourceStatusCellProps) {
  const [open, setOpen] = useState(false);
  const statusKey = currentStatus || SourceStatusEnum.PENDING;
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
          <UpdateSourceStatus
            sourceId={sourceId}
            currentStatus={currentStatus}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

