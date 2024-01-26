import { Db, MongoClient } from 'mongodb';
import { TraceDetailResponse } from '../models/trace_detail_response';
import 'dotenv/config';
import { TracePercentile } from '../models/traces_percentiles';
import { FeedbackCountResponse } from '../models/feedback_count_response';

export class ApiRepository {
  private db!: Db;

  private collectionName = process.env.LANGTRACE_TRACES_MONGODB_COLLECTION_NAME!;

  constructor() {
    const api = process.env.LANGTRACE_API_MONGODB_URI!;
    const client = new MongoClient(api);

    client.connect().then(() => {
      this.db = client.db(process.env.LANGTRACE_MONGODB_DB_NAME);
    }).catch(error => {
      console.error('Failed to connect to MongoDB', error);
    });
  }

  async getTraces(startDate?: Date, endDate?: Date): Promise<TraceDetailResponse[]> {
    const pipeline = [
      {
        $match: {
          'parent_run_id': null,
          ...(startDate && { 'start_time': { $gte: startDate } }),
          ...(endDate && { 'end_time': { $lte: endDate } })
        }
      },
      {
        $addFields: {
          latency: {
            $subtract: ['$end_time', '$start_time']
          }
        }
      },
      {
        $project: {
          _id: 0,
          run_id: 1,
          name: 1,
          start_time: 1,
          end_time: 1,
          latency: 1,
          feedback: 1
        }
      },
      { $sort: { start_time: -1 } },
      // { $limit: 100 }
    ];

    const collection = this.db.collection(this.collectionName);
    return await collection
      .aggregate<TraceDetailResponse>(pipeline)
      .toArray();
  }

  async getLatencyPercentile(startDate?: Date, endDate?: Date): Promise<TracePercentile[]> {
    const collection = this.db.collection(this.collectionName);

    const percentiles = [0.5, 0.9, 0.95, 0.99];

    const pipeline = [
      {
        $match: {
          parent_run_id: null,
          ...(startDate && { 'start_time': { $gte: startDate } }),
          ...(endDate && { 'end_time': { $lte: endDate } })
        }
      },
      {
        $addFields: {
          latency: {
            $subtract: ['$end_time', '$start_time'],
          },
        },
      },
      {
        $group: {
          _id: null,
          latency_percentiles: {
            $percentile: {
              input: '$latency',
              p: percentiles,
              method: 'approximate',
            },
          },
        },
      },
      {
        $project: {
          _id: 0
        }
      }
    ];

    interface TracesPercentilesMongoRecord {
      latency_percentiles: number[];
    }

    const result = await collection.aggregate<TracesPercentilesMongoRecord>(pipeline).toArray();

    return percentiles.map((percentile, index) => {
      return {
        percentile: percentile,
        latency: result[0]?.latency_percentiles[index]
      } as TracePercentile;
    });
  }

  async getTraceTreeById(run_id: string): Promise<TraceDetailResponse[]> {
    const collection = this.db.collection(this.collectionName);
    return collection.aggregate<TraceDetailResponse>(
      [
        {
          $match: {
            run_id: run_id,
          },
        },
        {
          $graphLookup: {
            from: 'traces',
            startWith: '$run_id',
            connectFromField: 'run_id',
            connectToField: 'parent_run_id',
            as: 'children',
            depthField: 'depth',
            restrictSearchWithMatch: {
              parent_run_id: {
                $ne: null,
              },
            },
          },
        },
        {
          $addFields: {
            latency: {
              $cond: {
                if: {
                  $and: [
                    '$end_time',
                    {
                      $ne: ['$end_time', ''],
                    },
                  ],
                },
                then: {
                  $subtract: [
                    '$end_time',
                    '$start_time',
                  ],
                },
                else: '$$REMOVE',
              },
            },
            children: {
              $map: {
                input: '$children',
                as: 'record',
                in: {
                  $mergeObjects: [
                    '$$record',
                    {
                      latency: {
                        $cond: {
                          if: {
                            $and: [
                              '$$record.end_time',
                              {
                                $ne: [
                                  '$$record.end_time',
                                  '',
                                ],
                              },
                            ],
                          },
                          then: {
                            $subtract: [
                              '$$record.end_time',
                              '$$record.start_time',
                            ],
                          },
                          else: '$$REMOVE',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            run_id: 1,
            parent_run_id: 1,
            name: 1,
            start_time: 1,
            end_time: 1,
            run_type: 1,
            session_name: 1,
            latency: 1,
            inputs: 1,
            outputs: 1,
            error: 1,
            execution_order: 1,
            children: {
              $map: {
                input: '$children',
                as: 'item',
                in: {
                  name: '$$item.name',
                  run_id: '$$item.run_id',
                  parent_run_id: '$$item.parent_run_id',
                  start_time: '$$item.start_time',
                  end_time: '$$item.end_time',
                  run_type: '$$item.run_type',
                  session_name: '$$item.session_name',
                  latency: '$$item.latency',
                  inputs: '$$item.inputs',
                  outputs: '$$item.outputs',
                  error: '$$item.error',
                  execution_order: '$$item.execution_order',
                  depth: '$$item.depth'
                },
              },
            },
          },
        },
      ]).toArray();
  }



  async getFeedbackCounts(startDate?: Date, endDate?: Date): Promise<FeedbackCountResponse[]> {
    const collection = this.db.collection(this.collectionName);
    return collection.aggregate<FeedbackCountResponse>(
      [
        {
          $match: {
            parent_run_id: null,
            ...(startDate && { 'start_time': { $gte: startDate } }),
            ...(endDate && { 'end_time': { $lte: endDate } }),
            feedback: {
              $exists: true,
            },
          },
        },
        {
          $project: {
            feedbackKey: '$feedback.key',
            feedbackValue: {
              $cond: [
                {
                  $or: [
                    {
                      $eq: ['$feedback.score', true],
                    },
                    {
                      $eq: ['$feedback.score', false],
                    },
                  ],
                },
                {
                  $cond: [
                    {
                      $eq: ['$feedback.score', true],
                    },
                    'true',
                    'false',
                  ],
                },
                {
                  $ifNull: ['$feedback.value', 'None'],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              key: '$feedbackKey',
              value: '$feedbackValue',
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: '$_id.key',
            feedbackCounts: {
              $push: {
                k: '$_id.value',
                v: '$count',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            key: '$_id',
            counts: {
              $arrayToObject: '$feedbackCounts',
            },
          },
        },
      ]).toArray();
  }





}
