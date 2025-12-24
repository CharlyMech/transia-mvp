import type { Note } from "@/models/note";
import { NoteSchema } from "@/models/note";
import type { INoteService } from "../interfaces";
import { supabase } from "./client";

export const listNotes: INoteService["listNotes"] = async () => {
	const { data, error } = await supabase.from("notes").select("*");
	if (error) throw error;

	const parsed = NoteSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Notes inválidas desde Supabase");
	}
	return parsed.data;
};

export const getNoteById: INoteService["getNoteById"] = async (id) => {
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
};

export const createNote: INoteService["createNote"] = async (noteData) => {
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
};

export const updateNote: INoteService["updateNote"] = async (id, text) => {
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
};

export const deleteNote: INoteService["deleteNote"] = async (id) => {
	const { error } = await supabase.from("notes").delete().eq("id", id);

	if (error) throw error;
};
