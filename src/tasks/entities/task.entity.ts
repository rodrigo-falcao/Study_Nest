export interface TaskEntity {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number | null; 
  createdAt?: Date | null;
}
