import { z } from "zod";

const VALIDATION_MESSAGES = {
	driverId: "El conductor es obligatorio",
	date: "La fecha es obligatoria",
	startTime: "La hora de inicio es obligatoria",
	endTime: "La hora de fin debe ser posterior a la hora de inicio",
	noteText: "El texto de la nota es obligatorio",
};

// Schema for a single note
export const NoteSchema = z.object({
	id: z.string().uuid(),
	text: z.string().min(1, VALIDATION_MESSAGES.noteText),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date().optional(),
});

// Schema for a single time range within a day
export const TimeRangeSchema = z.object({
	id: z.string().uuid(),
	startTime: z.coerce.date(),
	endTime: z.coerce.date().nullable().default(null),
	isPaused: z.boolean().default(false),
	pausedAt: z.coerce.date().nullable().default(null),
});

// Schema for a complete day's time registration
export const TimeRegistrationSchema = z
	.object({
		id: z.string().uuid(),
		driverId: z.string().uuid(VALIDATION_MESSAGES.driverId),
		date: z.coerce.date(),
		timeRanges: z.array(TimeRangeSchema).default([]),
		totalHours: z.number().default(0),
		isActive: z.boolean().default(false),
		notes: z.array(NoteSchema).default([]),
	})
	.refine(
		(data) => {
			// Validate that end times are after start times
			return data.timeRanges.every((range) => {
				if (range.endTime) {
					return range.endTime > range.startTime;
				}
				return true;
			});
		},
		{
			message: VALIDATION_MESSAGES.endTime,
		}
	);

// Form schema for creating/editing time ranges
export const TimeRangeFormSchema = z.object({
	startTime: z.string().min(1, VALIDATION_MESSAGES.startTime),
	endTime: z.string().optional(),
});

// Form schema for creating/editing notes
export const NoteFormSchema = z.object({
	text: z.string().min(1, VALIDATION_MESSAGES.noteText),
});

export type Note = z.infer<typeof NoteSchema>;
export type TimeRange = z.infer<typeof TimeRangeSchema>;
export type TimeRegistration = z.infer<typeof TimeRegistrationSchema>;
export type TimeRangeFormData = z.infer<typeof TimeRangeFormSchema>;
export type NoteFormData = z.infer<typeof NoteFormSchema>;
