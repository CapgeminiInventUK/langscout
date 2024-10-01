import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '@/components/global/code-block';

interface TraceDetailsFeedbackPanelProps {
  feedback: { [key: string]: any };
}

export default function TraceDetailsFeedbackPanel({ feedback }: TraceDetailsFeedbackPanelProps) {

  // Remove the run_id from the feedback object as its not needed when displaying
  delete feedback.run_id;

  return <Card>
    <CardHeader>
      <CardTitle>Feedback</CardTitle>
    </CardHeader>
    <CardContent className="rounded-b-lg bg-muted py-4">
      <CodeBlock>
        {JSON.stringify(feedback, null, 2)}
      </CodeBlock>
    </CardContent>
  </Card>
  ;
}
