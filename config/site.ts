export const siteConfig = {
  name: "Case Management System",
  description: "Modern case management application for efficient workflow",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/yourusername/case-management",
    docs: "/docs",
  },
};

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Cases",
    href: "/cases",
    icon: "FolderOpen",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
];
