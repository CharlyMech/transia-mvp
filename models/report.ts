import { ReportsTypes } from "@/constants/enums/ReportsTypes";
import { z } from "zod";

export const ReportSchema = z.object({
	id: z.string().uuid(),
	title: z.nativeEnum(ReportsTypes),
	description: z.string().min(1).optional(),
	vehicleId: z.string().uuid(),
	driverId: z.string().uuid(),
	createdAt: z.coerce.date(),
	readAt: z.coerce.date().nullable().default(null),
	closedAt: z.coerce.date().nullable().default(null),
	reporterComment: z.string().min(1).optional(),
	images: z.array(z.string().url()).default([]),
	read: z.boolean().default(false),
	active: z.boolean().default(true),
});

export type Report = z.infer<typeof ReportSchema>;
