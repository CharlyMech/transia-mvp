import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { z } from "zod";

// Parse ISO dates from JSON
const ISODate = z.string().transform((s) => new Date(s));

export const VehicleSchema = z.object({
	id: z.string().uuid(),
	vehicleBrand: z.string().min(1),
	vehicleModel: z.string().min(1),
	year: z.number().min(1900).max(2100),
	vehicleType: z.string().min(1),
	plateNumber: z.string().min(1),
	registrationDate: ISODate,
	purchaseDate: ISODate.optional(),
	imageUrl: z.string().nullable().optional(),
	status: z.nativeEnum(VehicleStatus),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
