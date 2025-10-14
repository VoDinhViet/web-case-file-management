import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 self-center group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="bg-primary flex size-12 items-center justify-center rounded-xl p-2.5 text-white transition-transform duration-300 group-hover:rotate-3">
            <LayoutDashboardIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Quản lý vụ án
            </h1>
            <p className="text-muted-foreground text-xs font-medium">
              Hệ thống quản lý chuyên nghiệp
            </p>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
}
