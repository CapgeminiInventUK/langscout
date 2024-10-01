import { FeedbackCreate } from 'langsmith/schemas';

export interface CreateFeedback extends FeedbackCreate {
  run_id: string;
}

export interface UpdateFeedback extends FeedbackCreate {
  run_id: string;
}
