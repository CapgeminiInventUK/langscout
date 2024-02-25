import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TraceTreeNode } from '@/models/responses/trace-detail-response';
import CodeBlock from '@/components/global/code-block';

interface TraceDetailsFeedbackPanelProps {
  feedback: { [key: string]: any };
}

interface Feedback {
  key: string;
  value?: any;
  score?: any;
}

export default function TraceDetailsFeedbackPanel({ feedback }: TraceDetailsFeedbackPanelProps) {

  const extractRelevantData = (data: any): Feedback => {
    return {
      key: data.key,
      value: data.value,
      score: data.score,
    };
  };

  return <Card>
    <CardHeader>
      <CardTitle>Feedback</CardTitle>
    </CardHeader>
    <CardContent className="rounded-b-lg bg-muted py-4">
      <CodeBlock>
        {JSON.stringify(extractRelevantData(feedback), null, 2)}
      </CodeBlock>
    </CardContent>
  </Card>
  ;
}
