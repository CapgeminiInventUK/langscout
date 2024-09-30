import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '@/components/global/code-block';
import { TraceData } from '@langscout/models';

interface TraceDetailsInputOutputPanelProps {
  selectedTrace: TraceData;
}

export default function TraceDetailsInputOutputPanel(
  { selectedTrace }: TraceDetailsInputOutputPanelProps
) {
  return <>
    <Card className="mt-2 mb-4">
      <CardHeader>
        <CardTitle>Inputs</CardTitle>
      </CardHeader>
      <CardContent className="rounded-b-lg bg-muted py-4">
        <CodeBlock>
          {JSON.stringify(selectedTrace.inputs, null, 2)}
        </CodeBlock>
      </CardContent>
    </Card>
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Outputs</CardTitle>
      </CardHeader>
      <CardContent className=" rounded-b-lg bg-muted py-4">
        <CodeBlock>
          {JSON.stringify(selectedTrace.outputs, null, 2)}
        </CodeBlock>
      </CardContent>
    </Card>
  </>;
}
