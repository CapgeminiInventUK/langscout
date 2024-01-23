export interface CreateFeedback {
  id: string;
  run_id: string;
  key: string;
  score?: number | boolean;
  value?: string;
  comment?: string;

  [key: string]: unknown;
}

export interface UpdateFeedback {
  score?: number | boolean;
  value?: string;
  correction?: { [key: string]: unknown };
  comment?: string;
}
