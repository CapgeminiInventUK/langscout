import { Db, MongoClient, UpdateResult } from 'mongodb';
import { TraceData } from '../models/requests/trace_request';
import { TraceDetailResponse } from '../models/trace_detail_response';
import 'dotenv/config';

export class LangtraceRepository {
  private db!: Db;

  private collectionName = process.env.MONGODB_TRACE_COLLECTION_NAME || '';

  constructor() {
    const uri = process.env.MONGODB_ATLAS_CLUSTER_URI || '';
    const client = new MongoClient(uri);
    client.connect().then(() => {
      this.db = client.db(process.env.MONGODB_DB_NAME);
    }).catch(error => {
      console.error('Failed to connect to MongoDB', error);
    });
  }

  async insertTrace(langtraceData: TraceData): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    await collection.insertOne(langtraceData);
  }

  async updateTrace(langtraceId: string, updateData: TraceData): Promise<UpdateResult> {
    const collection = this.db.collection(this.collectionName);
    return collection.updateOne({ run_id: langtraceId }, { $set: updateData });
  }

  async getChildrenForParentRunId(parentRunId: string): Promise<TraceDetailResponse[]> {
    const query = { 'parent_run_id': parentRunId };
    const fields = { '_id': 0 };

    const collection = this.db.collection(this.collectionName);
    return await collection.find<TraceDetailResponse>(query, { projection: fields }).toArray();
  }

  async getTraces(): Promise<TraceDetailResponse[]> {
    const query = { 'parent_run_id': null };
    const fields = { '_id': 0, 'run_id': 1, 'name': 1, 'start_time': 1, 'end_time': 1 };

    const collection = this.db.collection(this.collectionName);
    return await collection.find<TraceDetailResponse>(query, { projection: fields }).toArray();
  }

  async getTrace(langtraceId: string): Promise<TraceDetailResponse | null> {
    const collection = this.db.collection(this.collectionName);
    return collection.findOne<TraceDetailResponse>({ run_id: langtraceId });
  }
}
