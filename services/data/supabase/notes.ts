import type { Note, NoteFormData } from "@/models/note";
import { NoteSchema } from "@/models/note";
import { supabase } from "./client";

export async function listNotes(): Promise<Note[]> {
	const { data, error } = await supabase.from("notes").select("*");
	if (error) throw error;

	const parsed = NoteSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Notes inválidas desde Supabase");
	}
	return parsed.data;
}

export async function getNoteById(id: string): Promise<Note | null> {
	const { data, error } = await supabase
		.from("notes")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// No rows returned
			return null;
		}
		throw error;
	}

	const parsed = NoteSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Note inválida desde Supabase");
	}
	return parsed.data;
}

export async function createNote(noteData: NoteFormData): Promise<Note> {
	const newNote = {
		text: noteData.text,
		createdBy: noteData.createdBy,
		createdAt: new Date().toISOString(),
	};

	const { data, error } = await supabase
		.from("notes")
		.insert([newNote])
		.select()
		.single();

	if (error) throw error;

	const parsed = NoteSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Datos de nota inválidos desde Supabase");
	}

	return parsed.data;
}

export async function updateNote(id: string, text: string): Promise<Note> {
	const { data, error } = await supabase
		.from("notes")
		.update({
			text,
			updatedAt: new Date().toISOString(),
		})
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;

	const parsed = NoteSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Datos de nota inválidos desde Supabase");
	}

	return parsed.data;
}

export async function deleteNote(id: string): Promise<void> {
	const { error } = await supabase.from("notes").delete().eq("id", id);

	if (error) throw error;
}
