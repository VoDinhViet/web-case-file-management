import { notFound } from "next/navigation";
import { getCaseById } from "@/actions/case";
import { getCasePhases } from "@/actions/phase";
import { AddPhaseDialog } from "@/components/features/cases/add-phase-dialog";
import { CasePhasesTimeline } from "@/components/features/cases/case-phases-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseCustomGroups } from "./case-custom-groups";
import { CaseHeader } from "./case-header";
import { CaseInfoCard } from "./case-info-card";
import { CaseMetadataCard } from "./case-metadata-card";
import { CasePlansTabWrapper } from "./case-plans-tab-wrapper";

interface CaseDetailProps {
  caseId: string;
}

export async function CaseDetail({ caseId }: CaseDetailProps) {
  const [caseResult, phasesResult] = await Promise.all([
    getCaseById(caseId),
    getCasePhases(caseId),
  ]);

  if (!caseResult.success || !caseResult.data) {
    notFound();
  }

  const caseData = caseResult.data;
  const phases = phasesResult.data || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <CaseHeader caseData={caseData} caseId={caseId} />

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="info"
          >
            Thông tin
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="phases"
          >
            Giai đoạn
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="plans"
          >
            Kế hoạch
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-0">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column - Main Info */}
            <div className="md:col-span-2 space-y-6">
              <CaseInfoCard caseData={caseData} />
              <CaseCustomGroups caseData={caseData} />
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              <CaseMetadataCard caseData={caseData} caseId={caseId} />
            </div>
          </div>
        </TabsContent>

        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Giai đoạn vụ án</h3>
                <p className="text-sm text-muted-foreground">
                  Theo dõi các giai đoạn và tiến độ của vụ án
                </p>
              </div>
              <AddPhaseDialog caseId={caseId} />
            </div>
            <CasePhasesTimeline caseId={caseId} phases={phases} />
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-0">
          <CasePlansTabWrapper caseId={caseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
