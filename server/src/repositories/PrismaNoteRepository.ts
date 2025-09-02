import { PrismaClient } from '../generated/prisma';
import { Note, CreateNoteData, UpdateNoteData, NoteRepository } from '../models/Note';

export class PrismaNoteRepository implements NoteRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateNoteData): Promise<Note> {
    return this.prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId,
      },
    });
  }

  async findById(id: string): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateNoteData): Promise<Note> {
    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.note.delete({
      where: { id },
    });
  }

  async archive(id: string, isArchived: boolean): Promise<Note> {
    return this.prisma.note.update({
      where: { id },
      data: { isArchived },
    });
  }
}
