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
import { ArrowUpDown, Briefcase, Calendar, Phone, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Pagination, Staff } from "@/types";
import { StaffActions } from "./staff-actions";

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "fullName",
    header: "Nhân viên",
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string;
      const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{fullName}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.role === "staff" ? "Nhân viên" : "Quản trị viên"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Liên hệ",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-muted-foreground">
          {row.getValue("phone")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalCases",
    header: "Vụ án",
    cell: ({ row }) => {
      const totalCases = row.getValue("totalCases") as number;

      const getStatusConfig = (count: number) => {
        if (count === 0) {
          return {
            variant: "secondary" as const,
            className:
              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
            icon: "text-gray-500",
          };
        }
        if (count <= 3) {
          return {
            variant: "outline" as const,
            className:
              "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
            icon: "text-blue-600 dark:text-blue-400",
          };
        }
        if (count <= 7) {
          return {
            variant: "default" as const,
            className:
              "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
            icon: "text-orange-600 dark:text-orange-400",
          };
        }
        return {
          variant: "destructive" as const,
          className:
            "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
        };
      };

      const config = getStatusConfig(totalCases);

      return (
        <div className="flex items-center gap-2">
          <Briefcase className={`h-4 w-4 ${config.icon}`} />
          <Badge
            variant={config.variant}
            className={`font-semibold ${config.className}`}
          >
            {totalCases} {totalCases === 1 ? "vụ" : "vụ"}
          </Badge>
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
          Ngày tham gia
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
    cell: ({ row }) => (
      <div className="flex justify-center">
        <StaffActions staff={row.original as Staff} />
      </div>
    ),
  },
];
interface StaffTableClientProps {
  staff: Staff[];
  pagination: Pagination | null;
  currentPage: number;
}

export default function StaffTableClient({
  staff,
  pagination,
  currentPage,
}: StaffTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: staff,
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
                    <User className="h-10 w-10 opacity-20" />
                    <p className="text-sm font-medium">Không có dữ liệu</p>
                    <p className="text-xs">
                      Chưa có nhân viên nào trong hệ thống
                    </p>
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
