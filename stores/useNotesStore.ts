import type { Note, NoteFormData } from "@/models/note";
import { notes as notesService } from "@/services/data";
import { create } from "zustand";

interface NotesState {
	// Global
	notes: Note[];
	loading: boolean;
	error: string | null;
	initialized: boolean;

	// Current note
	currentNote: Note | null;
	loadingNote: boolean;
	noteError: string | null;

	// Cache for individual notes (for quick lookups)
	noteCache: Map<string, Note>;
}

interface NotesActions {
	// Data fetching
	fetchNotes: () => Promise<void>;
	fetchNoteById: (id: string) => Promise<void>;
	clearCurrentNote: () => void;

	// Helper to get note from cache or fetch
	getNoteById: (id: string) => Promise<Note | null>;

	// CRUD operations
	createNote: (data: NoteFormData) => Promise<Note>;
	updateNoteText: (id: string, text: string) => Promise<void>;
	deleteNoteById: (id: string) => Promise<void>;
}

type NotesStore = NotesState & NotesActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useNotesStore = create<NotesStore>((set, get) => ({
	// Global
	notes: [],
	loading: true,
	error: null,
	initialized: false,

	// Current note
	currentNote: null,
	loadingNote: false,
	noteError: null,

	// Cache
	noteCache: new Map(),

	fetchNotes: async () => {
		set({ loading: true, error: null });
		try {
			await delay(1000);
			const data = await notesService.listNotes();

			// Update cache
			const cache = new Map<string, Note>();
			data.forEach((note) => cache.set(note.id, note));

			set({ notes: data, noteCache: cache, loading: false, initialized: true });
		} catch (error) {
			console.error("Error fetching notes:", error);
			set({
				error: error instanceof Error ? error.message : "Error desconocido",
				loading: false,
				initialized: true,
			});
		}
	},

	fetchNoteById: async (id: string) => {
		set({ loadingNote: true, noteError: null, currentNote: null });
		try {
			await delay(500);

			// Try cache first
			let note = get().noteCache.get(id);

			// If not in cache, fetch from service
			if (!note) {
				const fetchedNote = await notesService.getNoteById(id);
				if (fetchedNote) {
					note = fetchedNote;
					// Update cache
					const cache = new Map(get().noteCache);
					cache.set(id, note);
					set({ noteCache: cache });
				}
			}

			if (!note) {
				throw new Error("Nota no encontrada");
			}

			set({ currentNote: note, loadingNote: false });
		} catch (error) {
			console.error("Error fetching note:", error);
			set({
				noteError:
					error instanceof Error ? error.message : "Error desconocido",
				loadingNote: false,
			});
		}
	},

	clearCurrentNote: () => {
		set({ currentNote: null, loadingNote: false, noteError: null });
	},

	getNoteById: async (id: string) => {
		// Try cache first
		const cached = get().noteCache.get(id);
		if (cached) {
			return cached;
		}

		// Fetch from service
		try {
			const note = await notesService.getNoteById(id);
			if (note) {
				// Update cache
				const cache = new Map(get().noteCache);
				cache.set(id, note);
				set({ noteCache: cache });
			}
			return note;
		} catch (error) {
			console.error("Error getting note:", error);
			return null;
		}
	},

	createNote: async (data: NoteFormData) => {
		try {
			const newNote = await notesService.createNote(data);

			// Update state
			set((state) => {
				const cache = new Map(state.noteCache);
				cache.set(newNote.id, newNote);

				return {
					notes: [...state.notes, newNote],
					noteCache: cache,
				};
			});

			return newNote;
		} catch (error) {
			console.error("Error creating note:", error);
			throw error;
		}
	},

	updateNoteText: async (id: string, text: string) => {
		try {
			const updatedNote = await notesService.updateNote(id, text);

			// Update state
			set((state) => {
				const cache = new Map(state.noteCache);
				cache.set(id, updatedNote);

				return {
					notes: state.notes.map((note) =>
						note.id === id ? updatedNote : note
					),
					noteCache: cache,
					currentNote:
						state.currentNote?.id === id
							? updatedNote
							: state.currentNote,
				};
			});
		} catch (error) {
			console.error("Error updating note:", error);
			throw error;
		}
	},

	deleteNoteById: async (id: string) => {
		try {
			await notesService.deleteNote(id);

			// Update state
			set((state) => {
				const cache = new Map(state.noteCache);
				cache.delete(id);

				return {
					notes: state.notes.filter((note) => note.id !== id),
					noteCache: cache,
					currentNote:
						state.currentNote?.id === id ? null : state.currentNote,
				};
			});
		} catch (error) {
			console.error("Error deleting note:", error);
			throw error;
		}
	},
}));
