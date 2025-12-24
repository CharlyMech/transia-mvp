import raw from "@/assets/mocks/notes.json";
import type { Note } from "@/models/note";
import { NoteSchema } from "@/models/note";
import * as Crypto from "expo-crypto";
import type { INoteService } from "../interfaces";

// In-memory store for mock (simulates database)
let mockNotes: Note[] = [];

export const listNotes: INoteService["listNotes"] = async () => {
	if (mockNotes.length === 0) {
		const parsed = NoteSchema.array().safeParse(raw);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Notes mock inválidas");
		}
		mockNotes = parsed.data;
	}
	return [...mockNotes];
};

export const getNoteById: INoteService["getNoteById"] = async (id) => {
	const notes = await listNotes();
	return notes.find((note) => note.id === id) || null;
};

export const createNote: INoteService["createNote"] = async (data) => {
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
};

export const updateNote: INoteService["updateNote"] = async (id, text) => {
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
};

export const deleteNote: INoteService["deleteNote"] = async (id) => {
	const notes = await listNotes();
	const index = notes.findIndex((note) => note.id === id);

	if (index === -1) {
		throw new Error("Nota no encontrada");
	}

	mockNotes.splice(index, 1);
};
