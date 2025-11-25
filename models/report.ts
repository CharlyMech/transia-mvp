import { ReportsTypes } from "@/constants/enums/ReportsTypes";
import { z } from "zod";

const VALIDATION_MESSAGES = {
	title: "El tipo de reporte es obligatorio",
	description: "La descripción debe tener al menos 10 caracteres",
	vehicleId: "El vehículo es obligatorio",
	driverId: "El conductor es obligatorio",
	latitude: "La latitud debe estar entre -90 y 90",
	longitude: "La longitud debe estar entre -180 y 180",
};

// Schema para coordenadas geográficas
export const LocationSchema = z.object({
	latitude: z
		.number()
		.min(-90, VALIDATION_MESSAGES.latitude)
		.max(90, VALIDATION_MESSAGES.latitude),
	longitude: z
		.number()
		.min(-180, VALIDATION_MESSAGES.longitude)
		.max(180, VALIDATION_MESSAGES.longitude),
	altitude: z.number().nullable().optional(),
	accuracy: z.number().nullable().optional(),
	address: z.string().optional(), // Readable address (geocoding reverse)
});

export const ReportSchema = z.object({
	id: z.string().uuid(),
	title: z.nativeEnum(ReportsTypes),
	description: z.string().min(10, VALIDATION_MESSAGES.description).optional(),
	vehicleId: z.string().uuid(VALIDATION_MESSAGES.vehicleId),
	driverId: z.string().uuid(VALIDATION_MESSAGES.driverId),
	createdAt: z.coerce.date(),
	readAt: z.coerce.date().nullable().default(null),
	closedAt: z.coerce.date().nullable().default(null),
	// Note reference (0:1 relationship - Report has one optional Note)
	noteId: z.string().uuid().nullable().optional(),
	images: z.array(z.string().url()).default([]),
	read: z.boolean().default(false),
	active: z.boolean().default(true),
	location: LocationSchema.nullable().optional(),
});

// Schema for form data (before submission)
export const ReportFormSchema = z.object({
	title: z.nativeEnum(ReportsTypes, {
		errorMap: () => ({ message: VALIDATION_MESSAGES.title }),
	}),
	description: z
		.string()
		.min(10, VALIDATION_MESSAGES.description)
		.optional()
		.or(z.literal("")),
	vehicleId: z.string().uuid(VALIDATION_MESSAGES.vehicleId),
	driverId: z.string().uuid(VALIDATION_MESSAGES.driverId),
	noteId: z.string().uuid().nullable().optional(),
	images: z.array(z.string()).default([]),
	location: LocationSchema.nullable().optional(),
});

export type Report = z.infer<typeof ReportSchema>;
export type ReportFormData = z.infer<typeof ReportFormSchema>;
export type Location = z.infer<typeof LocationSchema>;
