import raw from "@/assets/mocks/notes.json";
import type { Note, NoteFormData } from "@/models/note";
import { NoteSchema } from "@/models/note";
import * as Crypto from "expo-crypto";

// In-memory store for mock (simulates database)
let mockNotes: Note[] = [];

export async function listNotes(): Promise<Note[]> {
	if (mockNotes.length === 0) {
		const parsed = NoteSchema.array().safeParse(raw);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Notes mock inválidas");
		}
		mockNotes = parsed.data;
	}
	return [...mockNotes];
}

export async function getNoteById(id: string): Promise<Note | null> {
	const notes = await listNotes();
	return notes.find((note) => note.id === id) || null;
}

export async function createNote(data: NoteFormData): Promise<Note> {
	const notes = await listNotes();

	const newNote: Note = {
		id: Crypto.randomUUID(),
		text: data.text,
		createdBy: data.createdBy,
		createdAt: new Date(),
	};

	const parsed = NoteSchema.safeParse(newNote);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Datos de nota inválidos");
	}

	mockNotes.push(parsed.data);
	return parsed.data;
}

export async function updateNote(id: string, text: string): Promise<Note> {
	const notes = await listNotes();
	const index = notes.findIndex((note) => note.id === id);

	if (index === -1) {
		throw new Error("Nota no encontrada");
	}

	const updatedNote: Note = {
		...mockNotes[index],
		text,
		updatedAt: new Date(),
	};

	const parsed = NoteSchema.safeParse(updatedNote);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Datos de nota inválidos");
	}

	mockNotes[index] = parsed.data;
	return parsed.data;
}

export async function deleteNote(id: string): Promise<void> {
	const notes = await listNotes();
	const index = notes.findIndex((note) => note.id === id);

	if (index === -1) {
		throw new Error("Nota no encontrada");
	}

	mockNotes.splice(index, 1);
}
