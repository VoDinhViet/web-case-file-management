import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateCaseLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Heading Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Basic Info Card Skeleton */}
        <Card>
          <CardHeader className="border-b bg-muted/30">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              {["Điều", "Cán bộ", "Số bị can", "Loại tội phạm"].map(
                (label, index) => (
                  <div key={`basic-field-${index}`} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ),
              )}

              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Template Cards Skeleton */}
        {Array.from({ length: 2 }).map((_, cardIndex) => (
          <Card key={`template-card-skeleton-${cardIndex}`}>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, fieldIndex) => (
                  <div
                    key={`template-card-field-${cardIndex}-${fieldIndex}`}
                    className={
                      fieldIndex === 3 ? "md:col-span-2 space-y-2" : "space-y-2"
                    }
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton
                      className={
                        fieldIndex === 3 ? "h-24 w-full" : "h-10 w-full"
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Submit Buttons Skeleton */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Skeleton className="h-11 w-24" />
          <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </div>
  );
}
