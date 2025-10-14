import {
  ArrowRight,
  BarChart3,
  FolderOpen,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">CMS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Modern Case Management
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Streamline your workflow with our powerful case management system.
              Built with Next.js and shadcn/ui for the best developer
              experience.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/cases">View Cases</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="mx-auto max-w-[980px]">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <LayoutDashboard className="h-12 w-12 mb-4 text-primary" />
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>
                    Get a complete overview of all your cases at a glance
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <FolderOpen className="h-12 w-12 mb-4 text-primary" />
                  <CardTitle>Case Management</CardTitle>
                  <CardDescription>
                    Organize and track cases efficiently with powerful tools
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-12 w-12 mb-4 text-primary" />
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Gain insights with comprehensive analytics and reporting
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Built with Next.js and shadcn/ui. © 2025 Case Management System.
          </p>
        </div>
      </footer>
    </div>
  );
}
