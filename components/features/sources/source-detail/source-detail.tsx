import { notFound } from "next/navigation";
import { getSourceById } from "@/actions/source";
import { getSourcePhases } from "@/actions/source-phase";
import { AddSourcePhaseDialog } from "@/components/features/sources/add-source-phase-dialog";
import { SourcePhasesTimeline } from "@/components/features/sources/source-phases-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourceCustomGroups } from "./source-custom-groups";
import { SourceHeader } from "./source-header";
import { SourceInfoCard } from "./source-info-card";
import { SourceMetadataCard } from "./source-metadata-card";
import { SourcePlansTabWrapper } from "./source-plans-tab-wrapper";

interface SourceDetailProps {
  sourceId: string;
}

export async function SourceDetail({ sourceId }: SourceDetailProps) {
  const [sourceResult, phasesResult] = await Promise.all([
    getSourceById(sourceId),
    getSourcePhases(sourceId),
  ]);

  if (!sourceResult.success || !sourceResult.data) {
    notFound();
  }

  const sourceData = sourceResult.data;
  const phases = phasesResult.data || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <SourceHeader sourceData={sourceData} sourceId={sourceId} />

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

        <TabsContent value="info" className="space-y-0">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <SourceInfoCard sourceData={sourceData} />
              <SourceCustomGroups sourceData={sourceData} />
            </div>
            <div className="space-y-6">
              <SourceMetadataCard sourceData={sourceData} sourceId={sourceId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Giai đoạn nguồn tin</h3>
                <p className="text-sm text-muted-foreground">
                  Theo dõi các giai đoạn và tiến độ xử lý nguồn tin
                </p>
              </div>
              <AddSourcePhaseDialog sourceId={sourceId} />
            </div>
            <SourcePhasesTimeline sourceId={sourceId} phases={phases} />
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-0">
          <SourcePlansTabWrapper sourceId={sourceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
