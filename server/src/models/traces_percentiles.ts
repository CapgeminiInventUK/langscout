export interface TracesPercentilesMongo {
  latency_percentiles: number[]
}

export interface TracePercentile {
  percentile: number;
  latency: number;
}
