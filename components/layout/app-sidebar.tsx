"use client";

import {
  Briefcase,
  ChevronDown,
  FileSignature,
  LayoutDashboard,
  LayoutDashboardIcon,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { getCurrentUser } from "@/actions/auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { RoleEnum } from "@/types";

interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
  subItems?: NavItem[];
  roles?: RoleEnum[]; // Allowed roles for this menu item
}

// Determine if a given href should be considered active based on the current pathname
function isHrefActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Determine if a nav item (or any of its sub-items) is active
function isItemActive(pathname: string, item: NavItem): boolean {
  if (isHrefActive(pathname, item.href)) return true;
  if (item.subItems && item.subItems.length > 0) {
    return item.subItems.some((sub) => isHrefActive(pathname, sub.href));
  }
  return false;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    title: "Trang chủ",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "staff",
    title: "Quản lý nhân sự",
    href: "/staff",
    icon: Users,
    roles: [RoleEnum.ADMIN], // Only ADMIN can access
  },
  {
    id: "cases",
    title: "Quản lý vụ án",
    href: "/cases",
    icon: Briefcase,
  },
  {
    id: "templates",
    title: "Quản lý mẫu",
    href: "/templates",
    icon: FileSignature,
    roles: [RoleEnum.ADMIN], // Only ADMIN can access
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<RoleEnum | null>(null);

  // ✅ Load user role
  React.useEffect(() => {
    async function loadUserRole() {
      const { data: user } = await getCurrentUser();
      if (user && "role" in user) {
        setUserRole(user.role as RoleEnum);
      }
    }
    loadUserRole();
  }, []);

  // ✅ Load trạng thái mở từ localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("sidebar-open-item");
    if (saved) setOpenItem(saved);
  }, []);

  // ✅ Lưu trạng thái mở vào localStorage
  React.useEffect(() => {
    if (openItem) localStorage.setItem("sidebar-open-item", openItem);
    else localStorage.removeItem("sidebar-open-item");
  }, [openItem]);

  const handleToggle = React.useCallback((itemId: string) => {
    setOpenItem((prev) => (prev === itemId ? null : itemId));
  }, []);

  const handleNavigate = React.useCallback(
    (path?: string) => {
      if (path) router.push(path);
    },
    [router],
  );

  // Logout is handled elsewhere (header/user menu). Sidebar no longer shows a logout button.

  // Filter nav items based on user role
  const filteredNavItems = React.useMemo(() => {
    if (!userRole) return navItems;
    return navItems.filter((item) => {
      // If item has no roles restriction, show it to everyone
      if (!item.roles || item.roles.length === 0) return true;
      // Otherwise, check if user's role is in the allowed roles
      return item.roles.includes(userRole);
    });
  }, [userRole]);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
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
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-3 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Điều hướng
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isOpen = openItem === item.id;
                const isActive = isItemActive(pathname, item);

                return (
                  <SidebarMenuItem key={item.id}>
                    {item.subItems ? (
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => handleToggle(item.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={cn(
                              "h-11 w-full cursor-pointer font-medium rounded-lg transition-all duration-200",
                              "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
                              {
                                "bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary border-l-2 border-primary":
                                  isActive,
                              },
                            )}
                          >
                            <Icon className="size-5 transition-transform duration-200 group-hover:scale-110" />
                            <span className="flex-1 capitalize">
                              {item.title}
                            </span>
                            <ChevronDown
                              className={cn(
                                "size-4 transition-all duration-300",
                                {
                                  "rotate-180": isOpen,
                                },
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="transition-all duration-300">
                          <SidebarMenuSub
                            className={
                              "mx-0 ml-6 border-l-2 border-primary/20 px-0 py-2 space-y-1"
                            }
                          >
                            {item.subItems.map((sub) => (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  onClick={() => handleNavigate(sub.href)}
                                  isActive={isHrefActive(pathname, sub.href)}
                                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold h-10 cursor-pointer font-medium rounded-lg transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-50" />
                                  {sub.title}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        onClick={() => handleNavigate(item.href)}
                        className={cn(
                          "h-11 cursor-pointer font-medium rounded-lg transition-all duration-200 px-4",
                          "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
                          {
                            "bg-primary text-white hover:!bg-primary hover:!text-white":
                              isActive,
                          },
                        )}
                      >
                        <Icon className="size-5 transition-transform duration-200 group-hover:scale-110" />
                        <span className="capitalize">{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
