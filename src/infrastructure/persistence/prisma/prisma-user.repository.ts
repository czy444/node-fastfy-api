import { PrismaClient } from "@prisma/client";
import { User } from "core/domain/user/user.entity";
import { UserRepository } from "core/application/user/user.repository";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'points'> & { password: string }): Promise<User> {
    return this.prisma.user.create({ data: user });
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: user });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
