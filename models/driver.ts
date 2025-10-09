import { z } from "zod";
import { DriverStatus } from "@/constants/enums/DriverStatus";

// Parse ISO dates from JSON
const ISODate = z.string().transform((s) => new Date(s));

export const DriverSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	surnames: z.string().min(1),
	personId: z.string().min(1), // TODO: Regex DNI/NIE
	completeAddress: z.string().min(1),
	birthDate: ISODate,
	imageUrl: z.string().nullable().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	licenseNumber: z.string().optional(),
	registrationDate: ISODate,
	status: z.nativeEnum(DriverStatus),
});

export type Driver = z.infer<typeof DriverSchema>;
