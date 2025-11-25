import { z } from "zod";

const VALIDATION_MESSAGES = {
	vehicleId: "El vehículo es obligatorio",
	maintenanceType: "El tipo de mantenimiento es obligatorio",
	scheduledDate: "La fecha programada es obligatoria",
	description: "La descripción debe tener al menos 10 caracteres",
	cost: "El coste debe ser mayor o igual a 0",
	workshopName: "El nombre del taller es obligatorio",
};

export enum MaintenanceType {
	SCHEDULED_MAINTENANCE = "Mantenimiento programado", // Regular maintenance
	WORKSHOP_APPOINTMENT = "Cita de taller", // Workshop appointment
	ITV = "ITV", // Technical vehicle inspection
	TIRE_CHANGE = "Cambio de neumáticos",
	OIL_CHANGE = "Cambio de aceite",
	BRAKE_SERVICE = "Servicio de frenos",
	REPAIR = "Reparación",
	OTHER = "Otro",
}

export enum MaintenanceStatus {
	PENDING = "Pendiente",
	SCHEDULED = "Programado",
	IN_PROGRESS = "En progreso",
	COMPLETED = "Completado",
	CANCELLED = "Cancelado",
}

const ISODate = z.string().transform((s) => new Date(s));

export const VehicleMaintenanceSchema = z.object({
	id: z.string().uuid(),
	vehicleId: z.string().uuid(VALIDATION_MESSAGES.vehicleId),
	maintenanceType: z.nativeEnum(MaintenanceType),
	status: z.nativeEnum(MaintenanceStatus),
	// Dates
	scheduledDate: ISODate, // When the maintenance is scheduled
	completedDate: ISODate.nullable().optional(), // When it was actually completed
	// Details
	description: z.string().min(10, VALIDATION_MESSAGES.description).optional(),
	workshopName: z.string().min(1, VALIDATION_MESSAGES.workshopName).optional(),
	cost: z.number().min(0, VALIDATION_MESSAGES.cost).optional(),
	mileage: z.number().optional(), // Kilometraje en el momento del mantenimiento
	// Additional info
	nextMaintenanceDate: ISODate.nullable().optional(), // Fecha sugerida para próximo mantenimiento
	notes: z.string().optional(),
	// Images/documents
	documents: z.array(z.string().url()).default([]), // URLs of receipts, certificates, etc.
	// Metadata
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date().optional(),
});

// Form schema for creating/editing vehicle maintenance
export const VehicleMaintenanceFormSchema = z.object({
	vehicleId: z.string().uuid(VALIDATION_MESSAGES.vehicleId),
	maintenanceType: z.nativeEnum(MaintenanceType, {
		errorMap: () => ({ message: VALIDATION_MESSAGES.maintenanceType }),
	}),
	status: z.nativeEnum(MaintenanceStatus).default(MaintenanceStatus.PENDING),
	scheduledDate: z.string().min(1, VALIDATION_MESSAGES.scheduledDate),
	completedDate: z.string().optional().or(z.literal("")),
	description: z
		.string()
		.min(10, VALIDATION_MESSAGES.description)
		.optional()
		.or(z.literal("")),
	workshopName: z.string().optional().or(z.literal("")),
	cost: z
		.number()
		.min(0, VALIDATION_MESSAGES.cost)
		.optional()
		.or(z.literal(0)),
	mileage: z.number().optional(),
	nextMaintenanceDate: z.string().optional().or(z.literal("")),
	notes: z.string().optional().or(z.literal("")),
	documents: z.array(z.string()).default([]),
});

export type VehicleMaintenance = z.infer<typeof VehicleMaintenanceSchema>;
export type VehicleMaintenanceFormData = z.infer<
	typeof VehicleMaintenanceFormSchema
>;
