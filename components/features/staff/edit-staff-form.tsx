import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateStaff } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type EditStaffFormData, editStaffSchema } from "@/schemas/staff";
import type { Staff } from "@/types/staff";

export function EditStaffForm({
  staff,
  onSuccess,
}: {
  staff: Staff;
  onSuccess?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditStaffFormData>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      fullName: staff.fullName ?? "",
      phone: staff.phone ?? "",
      password: "",
    },
  });

  async function onSubmit(values: EditStaffFormData) {
    startTransition(async () => {
      try {
        const { password, ...rest } = values;
        const payload = password ? values : rest;
        const result = await updateStaff(staff.id, payload);
        if (result.success) {
          toast.success(result.message || "Cập nhật nhân viên thành công");
          onSuccess?.(false);
          router.refresh();
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật nhân viên");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">Chỉnh sửa nhân viên</p>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin cơ bản
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số điện thoại <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="0912345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu (để trống nếu không đổi)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
