"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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
import type { Staff } from "@/types";

interface HeaderProps {
  user: Staff | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "UN";

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success("Đăng xuất thành công");
        router.push("/login");
      } else {
        toast.error(result.error || "Đăng xuất thất bại");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 hover:bg-muted"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                <span className="sr-only">Thông báo</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                Thông báo
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {/* Example notifications */}
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vụ án mới được tạo</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vụ án "Trộm cắp tài sản" đã được thêm vào hệ thống
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        2 phút trước
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Giai đoạn hoàn thành
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Giai đoạn "Điều tra" của vụ án ABC đã được đánh dấu hoàn
                        thành
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        1 giờ trước
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nhân viên mới</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nguyễn Văn A đã được thêm vào hệ thống
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        3 giờ trước
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="cursor-pointer justify-center text-center"
              >
                <Link href="/notifications" className="w-full">
                  Xem tất cả thông báo
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-muted"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/10">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">
                      {user?.fullName || "User Name"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.phone || "Chưa có số điện thoại"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">Hồ sơ cá nhân</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings">Cài đặt</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
