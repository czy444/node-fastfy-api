export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  points: number;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
