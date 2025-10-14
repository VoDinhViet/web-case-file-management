"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, MessageSquarePlus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createNote } from "@/actions/activity";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const createNoteSchema = z.object({
  content: z.string().min(1, "Nội dung ghi chú là bắt buộc"),
});

type CreateNoteForm = z.infer<typeof createNoteSchema>;

interface AddNoteDialogProps {
  caseId: string;
  userId: string;
}

export function AddNoteDialog({ caseId, userId }: AddNoteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateNoteForm>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(values: CreateNoteForm) {
    startTransition(async () => {
      try {
        const result = await createNote({
          caseId,
          userId,
          content: values.content,
        });

        if (result.success) {
          toast.success(result.message || "Tạo ghi chú thành công");
          form.reset();
          setOpen(false);
          window.location.reload(); // Reload to refresh data
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi khi tạo ghi chú");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Thêm ghi chú
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm ghi chú</DialogTitle>
          <DialogDescription>
            Thêm ghi chú hoặc nhận xét về vụ án này
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nội dung <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung ghi chú..."
                      {...field}
                      disabled={isPending}
                      rows={5}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo ghi chú"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
