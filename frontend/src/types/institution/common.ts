export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BaseModel {
  id: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}