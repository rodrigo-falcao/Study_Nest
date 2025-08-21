export interface TaskEntity {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
}
