import { MongoClient, Db, UpdateResult } from 'mongodb';
import { TraceData } from '../models/requests/trace_request';

export class LangmonitorRepository {
  private db!: Db;

  private collectionName = 'traces';

  constructor() {
    const uri = process.env.MONGODB_ATLAS_CLUSTER_URI || '';
    const client = new MongoClient(uri);
    client.connect().then(() => {
      this.db = client.db(process.env.MONGODB_DB_NAME);
    }).catch(error => {
      console.error('Failed to connect to MongoDB', error);
    });
  }

  async insertTrace(langMonitorData: TraceData): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    await collection.insertOne(langMonitorData);
  }

  async updateTrace(langMonitorId: string, updateData: TraceData): Promise<UpdateResult<any>> {
    const collection = this.db.collection(this.collectionName);
    return collection.updateOne({ run_id: langMonitorId }, { $set: updateData });
  }
}
