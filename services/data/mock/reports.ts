import raw from "@/assets/mocks/reports.json";
import { ReportSchema } from "@/models";
import type { IReportService } from "../interfaces";

export const listReports: IReportService["listReports"] = async () => {
	const parsed = ReportSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Reports mock inválidos");
	}
	return parsed.data;
};

export const getReportById: IReportService["getReportById"] = async (id) => {
	const reports = await listReports();
	return reports.find((report) => report.id === id) || null;
};
