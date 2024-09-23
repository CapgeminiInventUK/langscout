import { Db, MongoClient, UpdateResult } from 'mongodb';
import 'dotenv/config';
import { CreateFeedback, UpdateFeedback, TraceData } from '@langscout/models';

export class MongodbRepository {
  private db!: Db;

  private collectionName = process.env.LANGSCOUT_TRACES_MONGODB_COLLECTION_NAME!;

  constructor() {
    const api = process.env.LANGSCOUT_INGEST_MONGODB_URI!;
    const client = new MongoClient(api);

    client.connect().then(() => {
      this.db = client.db(process.env.LANGSCOUT_MONGODB_DB_NAME);
    }).catch(error => {
      console.error('Failed to connect to MongoDB', error);
    });
  }

  async insertTrace(langscoutData: TraceData): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    await collection.insertOne(langscoutData);
  }

  async updateTrace(langscoutId: string, updateData: TraceData): Promise<UpdateResult> {
    const collection = this.db.collection(this.collectionName);
    return collection.updateOne({ run_id: { $eq: langscoutId } }, { $set: { ...updateData } });
  }

  async insertFeedbackOnTraceByRunId(feedback: CreateFeedback) {
    const collection = this.db.collection(this.collectionName);
    await collection.updateOne({ run_id: { $eq: feedback.run_id } }, { $set: { feedback } });
  }

  async updateFeedbackOnTraceByFeedbackId(
    feedbackId: string,
    feedbackData: UpdateFeedback):
    Promise<UpdateResult> {
    const collection = this.db.collection(this.collectionName);

    const setOperation: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(feedbackData)) {
      setOperation[`feedback.${key}`] = value;
    }

    return await collection.updateOne({ 'feedback.id': feedbackId },
      { $set: setOperation });
  }
}
