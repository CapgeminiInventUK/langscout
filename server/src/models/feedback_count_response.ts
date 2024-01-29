export interface FeedbackCountResponse {
  key: string;
  feedbackType: string;
  counts: { [key: string]: number };
}
