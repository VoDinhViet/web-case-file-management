import { Suspense } from "react";
import { getCurrentUser } from "@/actions/auth";
import { ReferralCardWrapper } from "@/components/features/dashboard/referral-card-wrapper";
import { StatusStats } from "@/components/features/dashboard/status-stats";
import { Skeleton } from "@/components/ui/skeleton";
import {
  dashboardSearchParamsSchema,
} from "@/schemas/dashboard";
import { RoleEnum } from "@/types/staff";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const validatedParams = dashboardSearchParamsSchema.parse(params);
  // Get current user to check role
  const { data: myUser } = await getCurrentUser();
  const isAdministrator = myUser?.role === RoleEnum.ADMIN;

  return (
    <div className="space-y-6">
      <Suspense fallback={<StatsSkeleton />}>
        <StatusStats validatedParams={validatedParams} />
      </Suspense>

      {isAdministrator && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Suspense fallback={<ReferralSkeleton />}>
            <ReferralCardWrapper />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }, (_, i) => `stat-${i}`).map((id) => (
        <div key={id} className="rounded-lg border-l-4 p-5 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-14 w-14 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReferralSkeleton() {
  return (
    <div className="rounded-lg border-0 border-l-4 border-l-primary bg-card shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
