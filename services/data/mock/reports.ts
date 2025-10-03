import raw from "@/assets/mocks/reports.json";
import type { Report } from "@/models";
import { ReportSchema } from "@/models";

export async function listReports(): Promise<Report[]> {
	const parsed = ReportSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Reports mock inválidos");
	}
	return parsed.data;
}
