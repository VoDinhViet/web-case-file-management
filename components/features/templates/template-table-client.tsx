"use client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowUpDown,
  Calendar,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CaseTemplate, Pagination } from "@/types";

export const columns: ColumnDef<CaseTemplate>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0"
        >
          Tiêu đề
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 max-w-md">
          <span className="font-medium text-sm">{row.getValue("title")}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {row.original.description}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "groups",
    header: "Cấu trúc",
    cell: ({ row }) => {
      const groups = row.original.groups || [];
      const totalFields = groups.reduce(
        (sum, group) => sum + (group.fields?.length || 0),
        0,
      );
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-semibold">
              {groups.length} nhóm
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {totalFields} trường
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0"
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(date, "dd/MM/yyyy", { locale: vi })}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Thao tác</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const template = row.original;
      return <ActionsCell template={template} />;
    },
  },
];

// Actions Cell Component
function ActionsCell({ template }: { template: CaseTemplate }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleEdit = () => {
    router.push(`/templates/${template.id}/edit`);
  };

  const handleView = () => {
    router.push(`/templates/${template.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { deleteTemplate } = await import("@/actions/template");
      const result = await deleteTemplate(template.id);
      if (result.success) {
        toast.success(result.message || "Đã xóa mẫu thành công");
        setShowDeleteDialog(false);
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
    <>
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted"
              disabled={isDeleting}
            >
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs font-semibold">
              Thao tác
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleView}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Xem chi tiết</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mẫu</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                Bạn có chắc chắn muốn xóa mẫu &quot;
                <span className="font-semibold text-foreground">
                  {template.title}
                </span>
                &quot;?
              </span>
              <span className="block">
                Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn mẫu này
                khỏi hệ thống.
              </span>
              <span className="block mt-3 text-destructive font-medium">
                ⚠️ Cảnh báo: Tất cả các trường và cấu hình (
                {template.groups.length} nhóm,{" "}
                {template.groups.reduce((sum, g) => sum + g.fields.length, 0)}{" "}
                trường) sẽ bị mất.
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
    </>
  );
}

interface TemplateTableClientProps {
  templates: CaseTemplate[];
  pagination: Pagination | null;
  currentPage: number;
}

export default function TemplateTableClient({
  templates,
  pagination,
  currentPage,
}: TemplateTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: templates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? -1,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pagination?.limit ?? 10,
      },
    },
  });

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newSize));
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const totalPages = pagination?.totalPages ?? 1;
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 hover:bg-muted/50 border-b"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 px-6 text-left align-middle font-semibold text-sm text-foreground/80"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    border-b last:border-b-0 transition-all duration-200
                    hover:bg-muted/30 data-[state=selected]:bg-muted/50
                    ${index % 2 === 0 ? "bg-background" : "bg-muted/10"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-10 w-10 opacity-20" />
                    <p className="text-sm font-medium">Không có dữ liệu</p>
                    <p className="text-xs">Chưa có mẫu nào trong hệ thống</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        totalRecords={pagination?.totalRecords ?? 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
