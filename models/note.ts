import { z } from "zod";

const VALIDATION_MESSAGES = {
	text: "El texto de la nota debe tener al menos 1 carácter",
};

// Schema for a single note entity
// Relación inversa: Report tiene noteId, TimeRegistration tiene noteId
// La nota no sabe a qué entidad pertenece
export const NoteSchema = z.object({
	id: z.string().uuid(),
	text: z.string().min(1, VALIDATION_MESSAGES.text),
	// Metadata
	createdBy: z.string().uuid(), // Driver ID que creó la nota
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date().optional(),
});

// Form schema for creating/editing notes
export const NoteFormSchema = z.object({
	text: z.string().min(1, VALIDATION_MESSAGES.text),
	createdBy: z.string().uuid(),
});

export type Note = z.infer<typeof NoteSchema>;
export type NoteFormData = z.infer<typeof NoteFormSchema>;
