export interface User {
  id: string;
  email: string;
  password?: string; 
  username: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}
