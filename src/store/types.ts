export interface Task {
  id: number;
  attributes: TaskAttributes;
}

export interface TaskAttributes {
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export type FilterType = 'all' | 'completed' | 'notCompleted' | 'favorite';

export type TaskStatus = 'completed' | 'notCompleted';

export interface FetchTasksParams {
  sort?: string;
  'pagination[withCount]'?: boolean;
  'pagination[page]'?: number;
  'pagination[pageSize]'?: number;
  'pagination[start]'?: number;
  'pagination[limit]'?: number;
  fields?: string;
  populate?: string;
  filters?: Record<string, any>;
  locale?: string;
}
