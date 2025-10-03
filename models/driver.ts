import { z } from "zod";

export const DriverSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	surnames: z.string().min(1),
	personId: z.string().min(1), // TODO: Implement regex for DNI&NIE
	completeAddress: z.string().min(1),
	// TODO: Image URL
	phone: z.string().optional(),
	email: z.string().optional(),
	// truckLicenseId: z.string().optional(), //??
	active: z.boolean().default(true),
});

export type Driver = z.infer<typeof DriverSchema>;
