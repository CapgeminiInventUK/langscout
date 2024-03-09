import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TraceTreeNode } from '@/models/responses/trace-detail-response';
import CodeBlock from '@/components/global/code-block';

interface TraceDetailsMetadataPanelProps {
  selectedTrace: TraceTreeNode;
}

export default function TraceDetailsMetadataPanel(
  { selectedTrace }: TraceDetailsMetadataPanelProps
) {
  return <Card className="mt-2 mb-4">
    <CardHeader>
      <CardTitle>Metadata</CardTitle>
    </CardHeader>
    <CardContent className="rounded-b-lg bg-muted py-4">
      <CodeBlock>
        {JSON.stringify(selectedTrace.metadata, null, 2)}
      </CodeBlock>
    </CardContent>
  </Card>;
}
