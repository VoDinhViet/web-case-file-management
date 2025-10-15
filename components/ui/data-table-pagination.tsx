"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageInfo?: boolean;
  showRecordRange?: boolean;
}

export function DataTablePagination<TData>({
  table,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageInfo = true,
  showRecordRange = true,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPage = pageIndex + 1;
  const totalPages =
    table.getPageCount() > 0
      ? table.getPageCount()
      : Math.ceil(totalRecords / pageSize);
  const startRecord = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
  const endRecord = Math.min((pageIndex + 1) * pageSize, totalRecords);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const formatNumber = (num: number) => num.toLocaleString("vi-VN");

  return (
    <div className="flex flex-col-reverse gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side - Record info */}
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount > 0 ? (
          <span>
            Đã chọn <span className="text-foreground">{selectedCount}</span>{" "}
            trong số {formatNumber(totalRecords)} kết quả
          </span>
        ) : (
          showRecordRange && (
            <span>
              Hiển thị{" "}
              <span className="font-medium">{formatNumber(startRecord)}</span>{" "}
              đến <span className="font-medium">{formatNumber(endRecord)}</span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{formatNumber(totalRecords)}</span>{" "}
              kết quả
            </span>
          )
        )}
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">
            Số hàng mỗi trang:
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        {showPageInfo && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Trang {currentPage} / {totalPages}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2">
          {/* First page */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Trang đầu</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Trang trước</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Next page */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Trang sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Trang cuối</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
