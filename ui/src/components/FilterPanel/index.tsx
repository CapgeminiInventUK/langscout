import React from 'react';
import { FeedbackCount, TracePercentile } from '@/models/traces-response';
import PercentileChip from '../PercentileChip';
import { FeedbackFilters } from '@/pages/projects/[projectId]/traces';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface StatsPanelProps {
  recordsCount: number;
  latencyPercentiles: TracePercentile[];
  feedbackCounts: FeedbackCount[];
  feedbackFilters: FeedbackFilters;
  onFeedbackSelect: (key: string, value: string, isSelected: boolean) => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  latencyPercentiles,
  recordsCount,
  feedbackCounts,
  feedbackFilters,
  onFeedbackSelect,
}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base font-bold">
          Records
        </p>
        <p className="text-sm font-medium">
          {recordsCount}
        </p>
        <Separator className="my-4"/>
        <p className="text-base text-muted-foreground">
          Percentiles
        </p>
        <p className="text-base font-bold">
          Latency
        </p>
        <div className="mt-4">
          {latencyPercentiles.filter(({ latency }) => latency).length ? <div>
            {latencyPercentiles.map(({ percentile, latency }, index) => {
              return latency && (
                <div key={index + '-chip-block'} className="mb-2">
                  <PercentileChip key={index + '-chip'} percentile={percentile} value={latency}/>
                </div>
              );
            })
            }
          </div> : <div>
            <p>No latency data available</p>
          </div>
          }
        </div>
        {feedbackCounts.length > 0 && <div className="mt-4">
          <Separator className="my-4"/>
          <p className="text-base text-muted-foreground">
            Feedback
          </p>
          {feedbackCounts.map(({ key, counts }, index) => {
            return (
              <div key={index + '-feedback-key'}>
                <p className="font-bold text-base">{key}</p>
                {counts && Object.entries(counts).map((
                  [
                    feedbackKey,
                    feedbackValue
                  ],
                  feedbackIndex) => (
                  <div key={feedbackKey} className="flex items-center space-x-2 my-1">
                    <Checkbox
                      id={feedbackIndex + '-checkbox'}
                      value={feedbackKey}
                      checked={feedbackFilters[key]?.includes(feedbackKey)}
                      onCheckedChange={(checked) =>
                        onFeedbackSelect(key,
                          feedbackKey,
                          checked.toString() === 'true')
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
        </div>
        }
      </CardContent>
    </Card>

  );
};

export default StatsPanel;
