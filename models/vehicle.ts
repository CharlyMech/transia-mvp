import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { VehicleTypes } from "@/constants/enums/VehicleTypes";
import { z } from "zod";

const ISODate = z.string().transform((s) => new Date(s));

const PLATE_REGEX = /^[A-Z0-9]{4,10}$/i;

const VALIDATION_MESSAGES = {
	vehicleBrand: "La marca es obligatoria",
	vehicleModel: "El modelo es obligatorio",
	vehicleType: "El tipo de vehículo es obligatorio",
	year: "El año debe estar entre 1900 y el año actual",
	plateNumber: "Matrícula inválida. Formato: 1234ABC",
	registrationDate: "La fecha de registro es obligatoria y debe ser válida",
	purchaseDate: "La fecha de compra debe ser válida",
};

export const VehicleSchema = z.object({
	id: z.string().uuid(),
	vehicleBrand: z.string().min(1, VALIDATION_MESSAGES.vehicleBrand),
	vehicleModel: z.string().min(1, VALIDATION_MESSAGES.vehicleModel),
	vehicleType: z.nativeEnum(VehicleTypes),
	year: z
		.number()
		.int()
		.min(1900, VALIDATION_MESSAGES.year)
		.max(new Date().getFullYear(), VALIDATION_MESSAGES.year),
	plateNumber: z
		.string()
		.min(1, VALIDATION_MESSAGES.plateNumber)
		.regex(PLATE_REGEX, VALIDATION_MESSAGES.plateNumber)
		.transform((val) => val.toUpperCase()),
	registrationDate: ISODate.default(
		() => new Date().toISOString().split("T")[0]
	),
	purchaseDate: ISODate.optional(),
	status: z.nativeEnum(VehicleStatus),
	imageUrl: z.string().nullable().optional(),
});

// Schema for form data (before submission)
export const VehicleFormSchema = z.object({
	vehicleBrand: z.string().min(1, VALIDATION_MESSAGES.vehicleBrand),
	vehicleModel: z.string().min(1, VALIDATION_MESSAGES.vehicleModel),
	vehicleType: z.nativeEnum(VehicleTypes),
	year: z
		.number()
		.int()
		.min(1900, VALIDATION_MESSAGES.year)
		.max(new Date().getFullYear(), VALIDATION_MESSAGES.year),
	plateNumber: z
		.string()
		.min(1, VALIDATION_MESSAGES.plateNumber)
		.regex(PLATE_REGEX, VALIDATION_MESSAGES.plateNumber)
		.transform((val) => val.toUpperCase()),
	registrationDate: z
		.string()
		.min(1, VALIDATION_MESSAGES.registrationDate)
		.default(() => new Date().toISOString().split("T")[0]),
	purchaseDate: z.string().optional().or(z.literal("")),
	status: z.nativeEnum(VehicleStatus).default(VehicleStatus.ACTIVE),
	imageUrl: z.string().nullable().optional(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
export type VehicleFormData = z.infer<typeof VehicleFormSchema>;
