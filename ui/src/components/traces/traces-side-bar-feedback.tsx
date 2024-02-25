import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { FeedbackCount } from '@/models/responses/traces-response';
import { ReactElement, useContext } from 'react';
import { TracesFilterContext } from '@/components/traces/contexts/traces-filter-context';

interface TracesSideBarFeedbackProps {
  feedback_counts: FeedbackCount[];
}

export default function TracesSideBarFeedback(
  { feedback_counts }: TracesSideBarFeedbackProps
): ReactElement {
  let {
    feedbackFilters,
    setFeedbackFilters,
    setChangePending,
  } = useContext(TracesFilterContext);

  const handleFeedbackSelect = (key: string, value: string, isSelected: boolean) => {
    setChangePending(true);
    const newFilters = { ...feedbackFilters };

    if (isSelected) {
      if (!newFilters[key]) {
        newFilters[key] = [];
      }
      if (!newFilters[key].includes(value)) {
        newFilters[key].push(value);
      }
    } else {
      newFilters[key] = (newFilters[key] ?? []).filter(v => v !== value);
      if (newFilters[key].length === 0) {
        delete newFilters[key];
      }
    }
    setFeedbackFilters(newFilters);
  };

  return <div className="mt-4">
    <Separator className="my-4"/>
    <p className="text-base text-muted-foreground">
      Feedback
    </p>
    {feedback_counts.map(({ key, counts }, index) => {
      return (
        <div key={index + '-feedback-key'}>
          <p className="font-bold text-base">{key}</p>
          {counts && Object.entries(counts).map((
            [
              feedbackKey,
              feedbackValue
            ],
            feedbackIndex) =>
            (
              <div key={feedbackKey} className="flex items-center space-x-2 my-1">
                <Checkbox
                  id={feedbackIndex + '-checkbox'}
                  value={feedbackKey}
                  checked={feedbackFilters[key]?.includes(feedbackKey) ?? false}
                  onCheckedChange={(checked) => {
                    handleFeedbackSelect(key,
                      feedbackKey,
                      checked.toString() === 'true');
                  }
                  }
                />
                <label
                  htmlFor={feedbackIndex + '-checkbox'}>
                  {`${feedbackKey}: ${feedbackValue}`}
                </label>

              </div>
            ))}
        </div>
      );
    })}
  </div>;
}
