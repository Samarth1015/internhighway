"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
class NoteService {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async createNote(data) {
        if (!data.title.trim() || !data.content.trim()) {
            throw new Error('Title and content are required');
        }
        return this.noteRepository.create(data);
    }
    async getNoteById(id) {
        return this.noteRepository.findById(id);
    }
    async getNotesByUserId(userId) {
        return this.noteRepository.findByUserId(userId);
    }
    async updateNote(id, data) {
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
    async deleteNote(id) {
        const note = await this.noteRepository.findById(id);
        if (!note) {
            throw new Error('Note not found');
        }
        await this.noteRepository.delete(id);
    }
    async archiveNote(id, isArchived) {
        const note = await this.noteRepository.findById(id);
        if (!note) {
            throw new Error('Note not found');
        }
        return this.noteRepository.archive(id, isArchived);
    }
}
exports.NoteService = NoteService;
