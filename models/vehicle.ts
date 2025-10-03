import { z } from "zod";

export const VehicleSchema = z.object({
	id: z.string().uuid(),
	vehicleBrand: z.string().min(1),
	vehicleModel: z.string().min(1),
	year: z.number().min(1900).max(2100),
	vehicleType: z.string().min(1),
	plateNumber: z.string().min(1),
	active: z.boolean().default(true),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
