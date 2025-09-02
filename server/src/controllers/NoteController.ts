import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { PrismaNoteRepository } from '../repositories/PrismaNoteRepository';

export class NoteController {
  private noteService: NoteService;

  constructor() {
    const noteRepository = new PrismaNoteRepository();
    this.noteService = new NoteService(noteRepository);
  }

  // GET /api/notes - Get all notes for the authenticated user
  async getNotes(req: any, res: Response): Promise<void> {
    try {
      const notes = await this.noteService.getNotesByUserId(req.user.id);
      res.json({ notes });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/notes - Create a new note
  async createNote(req: any, res: Response): Promise<void> {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }

      const note = await this.noteService.createNote({
        title,
        content,
        userId: req.user.id,
      });

      res.status(201).json({ note });
    } catch (error) {
      console.error('Error creating note:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // GET /api/notes/:id - Get a specific note
  async getNoteById(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const note = await this.noteService.getNoteById(id);
      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      // Check if note belongs to user
      if (note.userId !== req.user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json({ note });
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/notes/:id - Update a note
  async updateNote(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }

      // Check if note exists and belongs to user
      const existingNote = await this.noteService.getNoteById(id);
      if (!existingNote) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      if (existingNote.userId !== req.user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const note = await this.noteService.updateNote(id, { title, content });
      res.json({ note });
    } catch (error) {
      console.error('Error updating note:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // DELETE /api/notes/:id - Delete a note
  async deleteNote(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if note exists and belongs to user
      const existingNote = await this.noteService.getNoteById(id);
      if (!existingNote) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      if (existingNote.userId !== req.user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      await this.noteService.deleteNote(id);
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PATCH /api/notes/:id/archive - Archive/unarchive a note
  async archiveNote(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isArchived } = req.body;

      if (typeof isArchived !== 'boolean') {
        res.status(400).json({ error: 'isArchived must be a boolean' });
        return;
      }

      // Check if note exists and belongs to user
      const existingNote = await this.noteService.getNoteById(id);
      if (!existingNote) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      if (existingNote.userId !== req.user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const note = await this.noteService.archiveNote(id, isArchived);
      res.json({ note });
    } catch (error) {
      console.error('Error archiving note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
