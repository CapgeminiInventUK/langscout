export interface CreateFeedback {
  // TODO Validate that feedback_id is a UUID
  feedback_id: string;
  run_id?: string;
  key: string;
  score?: number | boolean;
  value?: string;
  comment?: string;

  [key: string]: unknown;
}
