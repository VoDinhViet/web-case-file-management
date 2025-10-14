import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CasesSearch } from "@/components/features/cases/cases-search";
import { Button } from "@/components/ui/button";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vụ án</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý và theo dõi tất cả vụ án
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/cases/select-template">
            <Plus className="mr-2 h-4 w-4" />
            Tạo vụ án mới
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <CasesSearch />
      </div>

      {children}
    </div>
  );
}
