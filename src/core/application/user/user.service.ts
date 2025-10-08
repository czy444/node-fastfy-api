import { User } from "core/domain/user/user.entity";
import { UserRepository } from "./user.repository";
import bcrypt from 'bcrypt';
import { generateToken } from 'utils/jwt';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'points'> & { password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password!, 10);
    const newUser = await this.userRepository.create({ ...user, password: hashedPassword });
    return newUser;
  }

  async login(email: string, password_candidate: string): Promise<{ user: User; token: string } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password_candidate, user.password!);
    if (!isPasswordValid) {
      return null;
    }

    const token = generateToken({ id: user.id, email: user.email });
    return { user, token };
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
