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
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { SourceStatusCell } from "@/components/features/sources/source-status-cell";
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
import type { Pagination, Source } from "@/types";

export const columns: ColumnDef<Source>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0"
        >
          Tên nguồn tin
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
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <SourceStatusCell
          sourceId={row.original.id}
          currentStatus={row.original.status}
        />
      );
    },
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
      const sourceItem = row.original;
      return <ActionsCell sourceItem={sourceItem} />;
    },
  },
];

// Actions Cell Component
function ActionsCell({ sourceItem }: { sourceItem: Source }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleView = () => {
    router.push(`/sources/${sourceItem.id}`);
  };

  const handleEdit = () => {
    router.push(`/sources/${sourceItem.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { deleteSource } = await import("@/actions/source");
      const result = await deleteSource(sourceItem.id);
      if (result.success) {
        toast.success(result.message || "Đã xóa nguồn tin thành công");
        setShowDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(result.error || "Không thể xóa nguồn tin");
      }
    } catch (error) {
      console.error("Error deleting source:", error);
      toast.error("Đã xảy ra lỗi khi xóa nguồn tin");
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
            <AlertDialogTitle>Xác nhận xóa nguồn tin</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                Bạn có chắc chắn muốn xóa nguồn tin &quot;
                <span className="font-semibold text-foreground">
                  {sourceItem.name}
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
              {isDeleting ? "Đang xóa..." : "Xóa nguồn tin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface SourcesTableClientProps {
  sources: Source[];
  pagination: Pagination | null;
  currentPage: number;
}

export function SourcesTableClient({
  sources,
  pagination,
  currentPage,
}: SourcesTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: sources,
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
                    <p className="text-sm font-medium">
                      Không có nguồn tin nào
                    </p>
                    <p className="text-xs">Hãy tạo nguồn tin mới để bắt đầu</p>
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
