import { DriverStatus } from "@/constants/enums/DriverStatus";
import { z } from "zod";

// Parse ISO dates from JSON
const ISODate = z.string().transform((s) => new Date(s));

// Regex patterns
const DNI_NIE_REGEX = /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i;
const PHONE_REGEX = /^\d{9}$/;
// const LICENSE_REGEX = /^[0-9]{8}[A-Z]{1,2}$/i;

// Validation messages
const VALIDATION_MESSAGES = {
	personId: "DNI/NIE inválido. Formato: 12345678A o X1234567A",
	phone: "Teléfono inválido. Debe ser un número español válido (sin extensión)",
	email: "Email inválido",
	// licenseNumber: "Número de licencia inválido. Formato: 12345678AB",
	name: "El nombre es obligatorio",
	surnames: "Los apellidos son obligatorios",
	completeAddress: "La dirección es obligatoria",
	birthDate: "La fecha de nacimiento es obligatoria y debe ser válida",
};

export const DriverSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, VALIDATION_MESSAGES.name),
	surnames: z.string().min(1, VALIDATION_MESSAGES.surnames),
	personId: z
		.string()
		.min(1, VALIDATION_MESSAGES.personId)
		.regex(DNI_NIE_REGEX, VALIDATION_MESSAGES.personId)
		.transform((val) => val.toUpperCase()),
	completeAddress: z.string().min(1, VALIDATION_MESSAGES.completeAddress),
	birthDate: ISODate,
	imageUrl: z.string().nullable().optional(),
	phone: z
		.string()
		.regex(PHONE_REGEX, VALIDATION_MESSAGES.phone)
		.optional()
		.or(z.literal("")),
	email: z
		.string()
		.email(VALIDATION_MESSAGES.email)
		.optional()
		.or(z.literal("")),
	licenseNumber: z
		.string()
		// .regex(LICENSE_REGEX, VALIDATION_MESSAGES.licenseNumber)
		.optional()
		.or(z.literal("")),
	registrationDate: ISODate,
	status: z.nativeEnum(DriverStatus),
});

// Schema for form data (before submission)
export const DriverFormSchema = z.object({
	name: z.string().min(1, VALIDATION_MESSAGES.name),
	surnames: z.string().min(1, VALIDATION_MESSAGES.surnames),
	personId: z
		.string()
		.min(1, VALIDATION_MESSAGES.personId)
		.regex(DNI_NIE_REGEX, VALIDATION_MESSAGES.personId)
		.transform((val) => val.toUpperCase()),
	completeAddress: z.string().min(1, VALIDATION_MESSAGES.completeAddress),
	birthDate: z.string().min(1, VALIDATION_MESSAGES.birthDate),
	imageUrl: z.string().nullable().optional(),
	phone: z
		.string()
		.regex(PHONE_REGEX, VALIDATION_MESSAGES.phone)
		.optional()
		.or(z.literal("")),
	email: z
		.string()
		.email(VALIDATION_MESSAGES.email)
		.optional()
		.or(z.literal("")),
	licenseNumber: z
		.string()
		// .regex(LICENSE_REGEX, VALIDATION_MESSAGES.licenseNumber)
		.optional()
		.or(z.literal("")),
	status: z.nativeEnum(DriverStatus).default(DriverStatus.ACTIVE),
});

export type Driver = z.infer<typeof DriverSchema>;
export type DriverFormData = z.infer<typeof DriverFormSchema>;
