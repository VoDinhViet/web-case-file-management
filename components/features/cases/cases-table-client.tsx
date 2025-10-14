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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Case, Pagination } from "@/types";

export const columns: ColumnDef<Case>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0"
        >
          Tên vụ án
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 max-w-md">
          <span className="font-medium text-sm truncate">
            {row.getValue("name")}
          </span>
          {row.original.description && (
            <span
              className="text-xs text-muted-foreground line-clamp-2"
              title={row.original.description}
            >
              {row.original.description}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "applicableLaw",
    header: "Điều",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("applicableLaw") || "-"}</span>
    ),
  },
  {
    accessorKey: "crimeType",
    header: "Loại tội phạm",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("crimeType") || "-"}</span>
    ),
  },
  {
    accessorKey: "numberOfDefendants",
    header: "Số bị can",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("numberOfDefendants") || 0}</span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Ngày khởi tố",
    cell: ({ row }) => {
      const date = row.getValue("startDate");
      if (!date) return <span className="text-sm">-</span>;
      return (
        <span className="text-sm">
          {format(new Date(date as string), "dd/MM/yyyy", { locale: vi })}
        </span>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "Ngày hết hạn",
    cell: ({ row }) => {
      const date = row.getValue("endDate");
      if (!date) return <span className="text-sm">-</span>;
      return (
        <span className="text-sm">
          {format(new Date(date as string), "dd/MM/yyyy", { locale: vi })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Thao tác</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const caseItem = row.original;
      return <ActionsCell caseItem={caseItem} />;
    },
  },
];

// Actions Cell Component
function ActionsCell({ caseItem }: { caseItem: Case }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleView = () => {
    router.push(`/cases/${caseItem.id}`);
  };

  const handleEdit = () => {
    router.push(`/cases/${caseItem.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { deleteCase } = await import("@/actions/case");
      const result = await deleteCase(caseItem.id);
      if (result.success) {
        toast.success(result.message || "Đã xóa vụ án thành công");
        setShowDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(result.error || "Không thể xóa vụ án");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("Đã xảy ra lỗi khi xóa vụ án");
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
              <Eye className="mr-2 h-4 w-4" />
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
            <AlertDialogTitle>Xác nhận xóa vụ án</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                Bạn có chắc chắn muốn xóa vụ án &quot;
                <span className="font-semibold text-foreground">
                  {caseItem.name}
                </span>
                &quot;?
              </span>
              <span className="block">Hành động này không thể hoàn tác.</span>
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
              {isDeleting ? "Đang xóa..." : "Xóa vụ án"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface CasesTableClientProps {
  cases: Case[];
  pagination: Pagination | null;
  currentPage: number;
}

export function CasesTableClient({
  cases,
  pagination,
  currentPage,
}: CasesTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: cases,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 0,
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

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    if (!Number.isNaN(newSize)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(newSize));
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > table.getPageCount()) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
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
                    className="h-12 px-4 text-left align-middle font-semibold text-sm"
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
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
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8" />
                    <p className="text-sm font-medium">Không có vụ án nào</p>
                    <p className="text-xs">Hãy tạo vụ án mới để bắt đầu</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-4 border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Hiển thị</p>
            <Select
              value={`${pagination.limit}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">/ trang</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-muted-foreground">
              Trang{" "}
              <span className="font-semibold text-foreground">
                {currentPage}
              </span>{" "}
              /{" "}
              <span className="font-semibold text-foreground">
                {table.getPageCount()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Trang đầu</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Trang trước</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === table.getPageCount()}
              >
                <span className="sr-only">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => handlePageChange(table.getPageCount())}
                disabled={currentPage === table.getPageCount()}
              >
                <span className="sr-only">Trang cuối</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
