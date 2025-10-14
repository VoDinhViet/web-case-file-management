"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTemplate } from "@/actions/template";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteTemplateButtonProps {
  templateId: string;
  templateTitle: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function DeleteTemplateButton({
  templateId,
  templateTitle,
  variant = "outline",
  size = "sm",
}: DeleteTemplateButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTemplate(templateId);
      if (result.success) {
        toast.success(result.message || "Đã xóa mẫu thành công");
        setIsOpen(false);
        router.push("/templates");
        router.refresh();
      } else {
        toast.error(result.error || "Không thể xóa mẫu");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Đã xảy ra lỗi khi xóa mẫu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa mẫu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa mẫu &quot;
            <span className="font-semibold text-foreground">
              {templateTitle}
            </span>
            &quot;? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn mẫu này
            khỏi hệ thống.
            {"\n\n"}
            <span className="block mt-2 text-destructive font-medium">
              ⚠️ Cảnh báo: Tất cả các trường và cấu hình trong mẫu sẽ bị mất.
            </span>
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
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : "Xóa mẫu"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
