"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const client_1 = require("@prisma/client");
class PrismaUserRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(data) {
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
    async findByClerkId(clerkId) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
        });
        if (!user)
            return null;
        return {
            ...user,
            name: user.name || undefined,
            imageUrl: user.imageUrl || undefined,
        };
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return {
            ...user,
            name: user.name || undefined,
            imageUrl: user.imageUrl || undefined,
        };
    }
    async update(id, data) {
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
    async delete(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
