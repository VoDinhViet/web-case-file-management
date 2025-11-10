"use client";

import type { PropsWithChildren, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BasicInfoCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  action?: ReactNode;
}

export function BasicInfoCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  action,
}: BasicInfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={cn(headerClassName)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription className="mt-1">{description}</CardDescription>
            ) : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
