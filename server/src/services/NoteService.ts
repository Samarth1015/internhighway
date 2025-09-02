import { Note, CreateNoteData, UpdateNoteData, NoteRepository } from '../models/Note';

export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async createNote(data: CreateNoteData): Promise<Note> {
    if (!data.title.trim() || !data.content.trim()) {
      throw new Error('Title and content are required');
    }

    return this.noteRepository.create(data);
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id);
  }

  async getNotesByUserId(userId: string): Promise<Note[]> {
    return this.noteRepository.findByUserId(userId);
  }

  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('Note not found');
    }

    if (data.title && !data.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    if (data.content && !data.content.trim()) {
      throw new Error('Content cannot be empty');
    }

    return this.noteRepository.update(id, data);
  }

  async deleteNote(id: string): Promise<void> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('Note not found');
    }

    await this.noteRepository.delete(id);
  }

  async archiveNote(id: string, isArchived: boolean): Promise<Note> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('Note not found');
    }

    return this.noteRepository.archive(id, isArchived);
  }
}
