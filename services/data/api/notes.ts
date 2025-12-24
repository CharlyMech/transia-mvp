import type { Note } from "@/models/note";
import { NoteSchema } from "@/models/note";
import type { INoteService } from "../interfaces";
import { apiClient } from "./client";

export const listNotes: INoteService["listNotes"] = async () => {
	const response = await apiClient.get<Note[]>("/notes");

	const parsed = NoteSchema.array().safeParse(response);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Notes inválidas desde API");
	}
	return parsed.data;
};

export const getNoteById: INoteService["getNoteById"] = async (id) => {
	try {
		const response = await apiClient.get<Note>(`/notes/${id}`);

		const parsed = NoteSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Note inválida desde API");
		}
		return parsed.data;
	} catch (error) {
		// Return null if note not found (404)
		if (error instanceof Error && error.message.includes("404")) {
			return null;
		}
		throw error;
	}
};

export const createNote: INoteService["createNote"] = async (noteData) => {
	const response = await apiClient.post<Note>("/notes", {
		text: noteData.text,
		createdBy: noteData.createdBy,
	});

	const parsed = NoteSchema.safeParse(response);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Datos de nota inválidos desde API");
	}

	return parsed.data;
};

export const updateNote: INoteService["updateNote"] = async (id, text) => {
	const response = await apiClient.patch<Note>(`/notes/${id}`, { text });

	const parsed = NoteSchema.safeParse(response);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Datos de nota inválidos desde API");
	}

	return parsed.data;
};

export const deleteNote: INoteService["deleteNote"] = async (id) => {
	await apiClient.delete(`/notes/${id}`);
};
