import type { Note, NoteFormData } from "@/models/note";

/**
 * Note service interface
 * All note data providers must implement this interface
 */
export interface INoteService {
	/**
	 * Get all notes
	 * @returns List of all notes
	 */
	listNotes(): Promise<Note[]>;

	/**
	 * Get a note by ID
	 * @param id - Note ID
	 * @returns Note object or null if not found
	 */
	getNoteById(id: string): Promise<Note | null>;

	/**
	 * Create a new note
	 * @param data - Note form data
	 * @returns Created note
	 */
	createNote(data: NoteFormData): Promise<Note>;

	/**
	 * Update an existing note
	 * @param id - Note ID
	 * @param text - New text content
	 * @returns Updated note
	 */
	updateNote(id: string, text: string): Promise<Note>;

	/**
	 * Delete a note
	 * @param id - Note ID
	 */
	deleteNote(id: string): Promise<void>;
}
