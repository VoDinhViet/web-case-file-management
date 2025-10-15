import { z } from "zod";

export const dashboardSearchParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().optional(),
});

export type DashboardSearchParams = z.infer<typeof dashboardSearchParamsSchema>;
