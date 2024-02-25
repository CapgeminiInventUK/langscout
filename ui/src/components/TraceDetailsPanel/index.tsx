import React from 'react';
import { TraceTreeNode } from '@/models/trace-detail-response';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TraceDetailsPanelProps {
  selectedTrace: TraceTreeNode | null;
}

const TraceDetailsPanel: React.FC<TraceDetailsPanelProps> = ({ selectedTrace }) => {
  return (
    selectedTrace && (
      <>
        <h4 className="text-xl font-semibold mb-2">{selectedTrace.name}</h4>
        <Tabs defaultValue="trace" className="w-full">
          <TabsList>
            <TabsTrigger value="trace">Trace</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="trace">
            <Card className="mt-2 mb-4">
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
              </CardHeader>
              <CardContent className="rounded-b-lg bg-muted py-4">
                <code
                  className="relative block p-2 overflow-x-auto font-mono text-sm font-semibold whitespace-pre-wrap">                  {JSON.stringify(selectedTrace.inputs, null, 2)}
                </code>
              </CardContent>
            </Card>
            <Card className="my-4">
              <CardHeader>
                <CardTitle>Outputs</CardTitle>
              </CardHeader>
              <CardContent className=" rounded-b-lg bg-muted py-4">
                <code
                  className="relative block p-2 overflow-x-auto font-mono text-sm font-semibold whitespace-pre-wrap">                  {JSON.stringify(selectedTrace.outputs?.output ?? selectedTrace.outputs, null, 2)}
                </code>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="metadata">
            <Card className="mt-2 mb-4">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="rounded-b-lg bg-muted py-4">
                <code
                  className="relative block p-2 overflow-x-auto font-mono text-sm font-semibold whitespace-pre-wrap">                  {JSON.stringify(selectedTrace.metadata, null, 2)}
                </code>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </>
    )
  );
};

export default TraceDetailsPanel;
