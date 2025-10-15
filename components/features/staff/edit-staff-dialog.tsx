"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Staff } from "@/types/staff";
import { EditStaffForm } from "./edit-staff-form";

interface EditStaffDialogProps {
  staff: Staff;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStaffDialog({
  staff,
  isOpen,
  onOpenChange,
}: EditStaffDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
          <DialogDescription>Cập nhật thông tin cơ bản</DialogDescription>
        </DialogHeader>
        <EditStaffForm staff={staff} onSuccess={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
