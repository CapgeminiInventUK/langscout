import { Badge } from '@/components/ui/badge';
import { TracePercentile } from '@/models/responses/traces-response';

interface TracesSideBarLatencyPercentilesProps {
  latency_percentiles: TracePercentile[];
}

export default function TracesSideBarLatencyPercentiles(
  { latency_percentiles }: TracesSideBarLatencyPercentilesProps
) {
  return <div className="mt-4">
    {latency_percentiles.filter(({ latency }) => latency).length ? <div>
      {latency_percentiles.map(({ percentile, latency }, index) => {
        return latency && (
          <div key={index + '-chip-block'} className="mb-2">
            <Badge variant={'outline'}>
              P{percentile * 100} - {(latency / 1000).toFixed(2)}s
            </Badge>
          </div>
        );
      })
      }
    </div> : <div>
      <p>No latency data available</p>
    </div>
    }
  </div>;
}
