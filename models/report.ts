import { z } from "zod";

export const ReportSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1),
	description: z.string().min(1).optional(),
	vehicleId: z.string().uuid(),
	driverId: z.string().uuid(),
	createdAt: z.coerce.date(),
	checkedAt: z.coerce.date().optional(),
	// TODO: Image URL
	read: z.boolean().default(false),
	active: z.boolean().default(true),
});

export type Report = z.infer<typeof ReportSchema>;
