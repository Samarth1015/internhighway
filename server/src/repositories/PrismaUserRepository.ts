import { PrismaClient } from '@prisma/client';
import { User, CreateUserData, UpdateUserData, UserRepository } from '../models/User';

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });
    return {
      ...user,
      name: user.name || undefined,
      imageUrl: user.imageUrl || undefined,
    };
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });
    if (!user) return null;
    return {
      ...user,
      name: user.name || undefined,
      imageUrl: user.imageUrl || undefined,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      ...user,
      name: user.name || undefined,
      imageUrl: user.imageUrl || undefined,
    };
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return {
      ...user,
      name: user.name || undefined,
      imageUrl: user.imageUrl || undefined,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
