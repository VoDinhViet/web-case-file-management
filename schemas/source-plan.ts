import { z } from "zod";

export const sourcePlanSchema = z.object({
  investigationResult: z.string(),
  exhibits: z.array(z.string()),
  nextInvestigationPurpose: z.string(),
  nextInvestigationContent: z.array(z.string()),
  participatingForces: z.array(z.string()),
  startDate: z.any().optional(),
  endDate: z.any().optional(),
  budget: z.string(),
});

export type SourcePlanFormData = z.infer<typeof sourcePlanSchema>;

