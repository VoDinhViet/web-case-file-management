"use client";

import { LogOut, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationList } from "@/components/notification-list";
import { NotificationPermissionButton } from "@/components/notification-permission-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { clearFCMCache } from "@/hooks/use-fcm-token";
import type { Staff } from "@/types";
import { useTransition } from "react";

interface HeaderProps {
  info: Staff | null;
}

export function Header({ info }: HeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initials = info?.fullName
    ? info.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "UN";

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const result = await logout();
        if (result.success) {
          clearFCMCache();
          toast.success("Đăng xuất thành công");
          router.push("/login");
        } else {
          toast.error(result.error || "Đăng xuất thất bại");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Đã xảy ra lỗi khi đăng xuất");
      }
    });
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />

          {/* Search - Desktop */}
          <div className="hidden md:flex">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm vụ án, mẫu, nhân viên..."
                className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search - Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <NotificationList />

          {/* Push Notification Permission */}
          <NotificationPermissionButton variant="ghost" size="icon" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Info */}
          <div className="hidden md:flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-1.5 transition-colors hover:bg-muted/70">
            <Avatar className="h-7 w-7 ring-2 ring-background">
              <AvatarImage src={"/avatar.png"} alt="User" />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-foreground leading-none truncate max-w-[120px]">
                {info?.fullName || "Tên người dùng"}
              </p>
              <p className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">
                {info?.phone || "Chưa có số điện thoại"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isPending}
            className="gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline text-sm">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
