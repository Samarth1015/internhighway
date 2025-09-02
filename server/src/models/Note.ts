export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteData {
  title: string;
  content: string;
  userId: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  isArchived?: boolean;
}

export interface NoteRepository {
  create(data: CreateNoteData): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  findByUserId(userId: string): Promise<Note[]>;
  update(id: string, data: UpdateNoteData): Promise<Note>;
  delete(id: string): Promise<void>;
  archive(id: string, isArchived: boolean): Promise<Note>;
}
