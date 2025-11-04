import { z } from "zod";

const VALIDATION_MESSAGES = {
	driverId: "El conductor es obligatorio",
	date: "La fecha es obligatoria",
	startTime: "La hora de inicio es obligatoria",
	endTime: "La hora de fin debe ser posterior a la hora de inicio",
};

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
		notes: z.string().optional().nullable(),
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

export type TimeRange = z.infer<typeof TimeRangeSchema>;
export type TimeRegistration = z.infer<typeof TimeRegistrationSchema>;
export type TimeRangeFormData = z.infer<typeof TimeRangeFormSchema>;
