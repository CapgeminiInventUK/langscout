import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '@/components/global/code-block';
import { TraceData } from '@langscout/models';

interface TraceDetailsMetadataPanelProps {
  selectedTrace: TraceData;
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
        {JSON.stringify(selectedTrace.extra['metadata'], null, 2)}
      </CodeBlock>
    </CardContent>
  </Card>;
}
