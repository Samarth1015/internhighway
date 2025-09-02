"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaNoteRepository = void 0;
const client_1 = require("@prisma/client");
class PrismaNoteRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(data) {
        return this.prisma.note.create({
            data: {
                title: data.title,
                content: data.content,
                userId: data.userId,
            },
        });
    }
    async findById(id) {
        return this.prisma.note.findUnique({
            where: { id },
        });
    }
    async findByUserId(userId) {
        return this.prisma.note.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async update(id, data) {
        return this.prisma.note.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await this.prisma.note.delete({
            where: { id },
        });
    }
    async archive(id, isArchived) {
        return this.prisma.note.update({
            where: { id },
            data: { isArchived },
        });
    }
}
exports.PrismaNoteRepository = PrismaNoteRepository;
