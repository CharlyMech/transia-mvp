import { z } from "zod";

const VALIDATION_MESSAGES = {
	vehicleId: "El vehículo es obligatorio",
	driverId: "El conductor es obligatorio",
	startDate: "La fecha de inicio es obligatoria",
	endDate: "La fecha de fin debe ser posterior a la fecha de inicio",
};

export enum AssignationStatus {
	ACTIVE = "Activa",
	COMPLETED = "Completada",
	CANCELLED = "Cancelada",
}

const ISODate = z.string().transform((s) => new Date(s));

export const VehicleAssignationSchema = z.object({
	id: z.string().uuid(),
	vehicleId: z.string().uuid(VALIDATION_MESSAGES.vehicleId),
	driverId: z.string().uuid(VALIDATION_MESSAGES.driverId),
	status: z.nativeEnum(AssignationStatus),
	// Dates
	startDate: ISODate,
	endDate: ISODate.nullable().optional(),
	// Additional info
	notes: z.string().optional(),
	startMileage: z.number().optional(), // Kilometraje al inicio de la asignación
	endMileage: z.number().optional(), // Kilometraje al fin de la asignación
	// Metadata
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date().optional(),
});

// Form schema for creating/editing vehicle assignations
export const VehicleAssignationFormSchema = z
	.object({
		vehicleId: z.string().uuid(VALIDATION_MESSAGES.vehicleId),
		driverId: z.string().uuid(VALIDATION_MESSAGES.driverId),
		status: z.nativeEnum(AssignationStatus).default(AssignationStatus.ACTIVE),
		startDate: z.string().min(1, VALIDATION_MESSAGES.startDate),
		endDate: z.string().optional().or(z.literal("")),
		notes: z.string().optional().or(z.literal("")),
		startMileage: z.number().optional(),
		endMileage: z.number().optional(),
	})
	.refine(
		(data) => {
			if (!data.endDate || data.endDate === "") return true;
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return end > start;
		},
		{
			message: VALIDATION_MESSAGES.endDate,
			path: ["endDate"],
		}
	);

export type VehicleAssignation = z.infer<typeof VehicleAssignationSchema>;
export type VehicleAssignationFormData = z.infer<
	typeof VehicleAssignationFormSchema
>;
