import { z } from "zod";

export const casePlanSchema = z.object({
  investigationResult: z.string(),
  exhibits: z.array(z.string()),
  nextInvestigationPurpose: z.string(),
  nextInvestigationContent: z.array(z.string()),
  participatingForces: z.array(z.string()),
});

export type CasePlanFormData = z.infer<typeof casePlanSchema>;
