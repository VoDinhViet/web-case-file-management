"use client";

import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-3xl font-bold">Đã xảy ra lỗi</h1>
        <p className="mb-2 text-muted-foreground">
          Không thể tải trang này. Vui lòng thử lại sau.
        </p>

        {/* Error details (only in dev) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mx-auto mb-6 mt-4 max-w-lg rounded-lg border bg-muted/30 p-4 text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
              {error.message}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} size="lg">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
