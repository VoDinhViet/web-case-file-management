import { getCasePlan } from "@/actions/case";
import { CasePlansTabClient } from "./case-plans-tab-client";

interface CasePlansTabWrapperProps {
  caseId: string;
}

export async function CasePlansTabWrapper({
  caseId,
}: CasePlansTabWrapperProps) {
  const result = await getCasePlan(caseId);
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

  return <CasePlansTabClient caseId={caseId} initialData={initialData} />;
}
