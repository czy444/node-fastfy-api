import { User } from "core/domain/user/user.entity";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'points'> & { password: string }): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
