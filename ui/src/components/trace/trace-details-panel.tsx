'use client';

import { useContext } from 'react';
import { TraceContext } from '@/components/trace/contexts/trace-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TraceDetailsMetadataPanel from '@/components/trace/trace-details-metadata-panel';
import TraceDetailsInputOutputPanel from '@/components/trace/trace-details-inputs-output-panel';
import TraceDetailsFeedbackPanel from '@/components/trace/trace-details-feedback-panel';

export default function TraceDetailsPanel() {
  const { selectedTrace } = useContext(TraceContext);

  return (
    selectedTrace && (
      <>
        <h4 className="text-xl font-semibold mb-2">{selectedTrace.name}</h4>
        <Tabs defaultValue="trace" className="w-full">
          <TabsList>
            <TabsTrigger value="trace">Trace</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            {selectedTrace?.feedback !== undefined && (
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="trace">
            <TraceDetailsInputOutputPanel selectedTrace={selectedTrace}/>
          </TabsContent>
          <TabsContent value="metadata">
            <TraceDetailsMetadataPanel selectedTrace={selectedTrace}/>
          </TabsContent>
          {selectedTrace?.feedback !== undefined && (
            <TabsContent value="feedback">
              <TraceDetailsFeedbackPanel feedback={selectedTrace.feedback}/>
            </TabsContent>
          )}
        </Tabs>
      </>
    )
  );
}
