"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(data) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByClerkId(data.clerkId);
        if (existingUser) {
            throw new Error('User already exists');
        }
        return this.userRepository.create(data);
    }
    async getUserByClerkId(clerkId) {
        return this.userRepository.findByClerkId(clerkId);
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async updateUser(id, data) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.update(id, data);
    }
    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(id);
    }
    async getOrCreateUser(clerkId, email, name, imageUrl) {
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
exports.UserService = UserService;
