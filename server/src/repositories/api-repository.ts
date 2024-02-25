import { Collection, Db, MongoClient } from 'mongodb';
import { TraceDetailResponse } from '../models/trace-detail-response';
import 'dotenv/config';
import { TracePercentile } from '../models/traces-percentiles';
import { FeedbackCountResponse } from '../models/feedback-count-response';
import { FeedbackFilters } from '../routers/langtrace/traces-router';
import { Document } from 'bson';

export class ApiRepository {
  private db: Db | undefined;
  private collectionName = process.env.LANGTRACE_TRACES_MONGODB_COLLECTION_NAME!;
  private client: MongoClient;

  constructor() {
    const connectionString = process.env.LANGTRACE_API_MONGODB_URI!;
    this.client = new MongoClient(connectionString);
  }

  async init(): Promise<void> {
    await this.client.connect();
    const dbName = process.env.LANGTRACE_MONGODB_DB_NAME;
    this.db = this.client.db(dbName);
  }

  private async getCollection(): Promise<Collection> {
    if (!this.db) {
      console.warn('MongoDB connection is not initialized');
      await this.init();
    }
    return this.db!.collection(this.collectionName);
  }

  private createMatchForFilters(feedbackFilters?: FeedbackFilters) {
    interface MongoDBQuery {
      $or?: { [key: string]: unknown }[];
    }

    const feedbackFilter: MongoDBQuery = {};
    if (feedbackFilters) {
      const orConditions = [];
      for (const key of Object.keys(feedbackFilters)) {
        const rawValues = feedbackFilters[key];
        const typedValues = [];

        for (const value of rawValues) {
          typedValues.push(value);

          if (value.toLowerCase() === 'true') {
            typedValues.push(true);
          } else if (value.toLowerCase() === 'false') {
            typedValues.push(false);
          }

          const num = parseFloat(value);
          if (!isNaN(num)) {
            typedValues.push(num);
          }
        }

        orConditions.push(
          { 'feedback.key': key, 'feedback.value': { $in: typedValues } },
          { 'feedback.key': key, 'feedback.score': { $in: typedValues } }
        );
      }

      if (orConditions.length > 0) {
        feedbackFilter.$or = orConditions;
      }
    }
    return feedbackFilter;
  }

  async getProjects(): Promise<Document[]> {
    const now: Date = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const collection = await this.getCollection();

    const aggregation =
      [
        {
          $match: {
            parent_run_id: null,
            start_time: { $gt: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$session_name',
            tracesLast24Hours: {
              $sum: {
                $cond: [{ $gt: ['$start_time', oneDayAgo] }, 1, 0]
              }
            },
            tracesLast7Days: {
              $sum: {
                $cond: [{ $gt: ['$start_time', sevenDaysAgo] }, 1, 0]
              }
            },
            tracesLast30Days: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            project_name: '$_id',
            tracesLast24Hours: 1,
            tracesLast7Days: 1,
            tracesLast30Days: 1
          }
        },
        {
          $sort: {
            project_name: 1
          }
        }
      ];


    return await collection.aggregate(aggregation).toArray();
  }

  async getTraces(
    projectId: string,
    startDate?: Date,
    endDate?: Date,
    feedbackFilters?: FeedbackFilters): Promise<TraceDetailResponse[]> {

    const feedbackFilter = this.createMatchForFilters(feedbackFilters);

    const pipeline = [
      {
        $match: {
          'parent_run_id': null,
          'session_name': projectId,
          ...(startDate && { 'start_time': { $gte: startDate } }),
          ...(endDate && { 'end_time': { $lte: endDate } }),
          ...feedbackFilter
        }
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
            session_name: projectId,
          },
        },
      },
      {
        $project: {
          _id: 0,
          run_id: 1,
          trace_id: 1,
          name: 1,
          start_time: 1,
          end_time: 1,
          feedback: 1,
          error: 1,
          latency: {
            $subtract: ['$end_time', '$start_time'],
          },
          totalInputCost: {
            $reduce: {
              input: '$children',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $gt: [
                          '$$this.extra.tokens.input.cost',
                          null,
                        ],
                      },
                      then: '$$this.extra.tokens.input.cost',
                      else: 0,
                    },
                  },
                ],
              },
            },
          },
          totalInputTokenCount: {
            $reduce: {
              input: '$children',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $gt: [
                          '$$this.extra.tokens.input.tokens',
                          null,
                        ],
                      },
                      then: '$$this.extra.tokens.input.tokens',
                      else: 0,
                    },
                  },
                ],
              },
            },
          },
          totalOutputCost: {
            $reduce: {
              input: '$children',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $gt: [
                          '$$this.extra.tokens.output.cost',
                          null,
                        ],
                      },
                      then: '$$this.extra.tokens.output.cost',
                      else: 0,
                    },
                  },
                ],
              },
            },
          },
          totalOutputTokenCount: {
            $reduce: {
              input: '$children',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $gt: [
                          '$$this.extra.tokens.output.tokens',
                          null,
                        ],
                      },
                      then: '$$this.extra.tokens.output.tokens',
                      else: 0,
                    },
                  },
                ],
              },
            },
          },
          totalCost: {
            $reduce: {
              input: '$children',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $gt: [
                          '$$this.extra.tokens.total.cost',
                          null,
                        ],
                      },
                      then: '$$this.extra.tokens.total.cost',
                      else: 0,
                    },
                  },
                ],
              },
            },
          },
          totalTokens: {
            $reduce: {
              input: '$children',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $gt: [
                          '$$this.extra.tokens.total.tokens',
                          null,
                        ],
                      },
                      then: '$$this.extra.tokens.total.tokens',
                      else: 0,
                    },
                  },
                ],
              },
            },
          }
        },
      },
      {
        $project: {
          children: 0,
        },
      },
      { $sort: { start_time: -1 } },
    ];

    const collection = await this.getCollection();
    return await collection
      .aggregate<TraceDetailResponse>(pipeline)
      .toArray();
  }

  async getLatencyPercentile(
    projectId: string,
    startDate?: Date,
    endDate?: Date,
    feedbackFilters?: FeedbackFilters): Promise<TracePercentile[]> {
    const collection = await this.getCollection();

    const percentiles = [0.5, 0.9, 0.95, 0.99];
    const feedbackFilter = this.createMatchForFilters(feedbackFilters);

    const pipeline = [
      {
        $match: {
          parent_run_id: null,
          'session_name': projectId,
          ...(startDate && { 'start_time': { $gte: startDate } }),
          ...(endDate && { 'end_time': { $lte: endDate } }),
          ...feedbackFilter
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

  async getTraceTreeById(projectId: string, run_id: string): Promise<TraceDetailResponse[]> {
    const collection = await this.getCollection();
    return collection.aggregate<TraceDetailResponse>(
      [
        {
          $match: {
            run_id: run_id,
            session_name: projectId,
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
              session_name: projectId,
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
            trace_id: 1,
            dotted_order: 1,
            feedback: 1,
            metadata: '$extra.metadata',
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
                  trace_id: '$$item.trace_id',
                  dotted_order: '$$item.dotted_order',
                  feedback: '$$item.feedback',
                  metadata: '$$item.extra.metadata',
                  depth: '$$item.depth'
                },
              },
            },
          },
        },
      ]).toArray();
  }


  async getFeedbackCounts(
    projectId: string,
    startDate?: Date,
    endDate?: Date): Promise<FeedbackCountResponse[]> {
    const collection = await this.getCollection();
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
            'session_name': projectId
          },
        },
        {
          $project: {
            feedbackKey: '$feedback.key',
            feedbackType: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$feedback.score', true] },
                    { $eq: ['$feedback.score', false] },
                  ],
                },
                then: 'score',
                else: 'value',
              },
            },
            feedbackValue: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$feedback.score', true] },
                    { $eq: ['$feedback.score', false] },
                  ],
                },
                {
                  $cond: [
                    { $eq: ['$feedback.score', true] },
                    'true',
                    'false',
                  ],
                },
                { $ifNull: ['$feedback.value', 'None'] },
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              key: '$feedbackKey',
              type: '$feedbackType',
              value: '$feedbackValue',
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            '_id.key': 1,
            '_id.type': 1,
            '_id.value': 1,
          },
        },
        {
          $group: {
            _id: {
              key: '$_id.key',
              type: '$_id.type',
            },
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
            key: '$_id.key',
            type: '$_id.type',
            counts: {
              $arrayToObject: {
                $map: {
                  input: {
                    $sortArray: {
                      input: '$feedbackCounts',
                      sortBy: { k: 1 },
                    },
                  },
                  as: 'item',
                  in: { k: '$$item.k', v: '$$item.v' },
                },
              },
            },
          },
        },
      ]).toArray();
  }
}
