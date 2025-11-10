import { getSourcePlan } from "@/actions/source";
import { SourcePlansTabClient } from "./source-plans-tab-client";

interface SourcePlansTabWrapperProps {
  sourceId: string;
}

export async function SourcePlansTabWrapper({
  sourceId,
}: SourcePlansTabWrapperProps) {
  const result = await getSourcePlan(sourceId);
  const initialData = result.data || {
    investigationResult: "",
    exhibits: [],
    nextInvestigationPurpose: "",
    nextInvestigationContent: [],
    participatingForces: [],
    startDate: undefined,
    endDate: undefined,
    budget: "",
  };

  return (
    <SourcePlansTabClient sourceId={sourceId} initialData={initialData} />
  );
}

