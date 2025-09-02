export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export interface UpdateUserData {
  name?: string;
  imageUrl?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByClerkId(clerkId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}
