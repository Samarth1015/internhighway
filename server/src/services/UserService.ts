import { User, CreateUserData, UpdateUserData, UserRepository } from '../models/User';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserData): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByClerkId(data.clerkId);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.userRepository.create(data);
  }

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return this.userRepository.findByClerkId(clerkId);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }

  async getOrCreateUser(clerkId: string, email: string, name?: string, imageUrl?: string): Promise<User> {
    let user = await this.userRepository.findByClerkId(clerkId);
    
    if (!user) {
      user = await this.userRepository.create({
        clerkId,
        email,
        name,
        imageUrl,
      });
    }

    return user;
  }
}
