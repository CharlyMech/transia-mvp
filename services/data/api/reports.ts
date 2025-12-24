import type { Report } from "@/models";
import { ReportSchema } from "@/models";
import type { IReportService } from "../interfaces";
import { apiClient } from "./client";

export const listReports: IReportService["listReports"] = async () => {
	const response = await apiClient.get<Report[]>("/reports");

	const parsed = ReportSchema.array().safeParse(response);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Reports inválidos desde API");
	}
	return parsed.data;
};

export const getReportById: IReportService["getReportById"] = async (id) => {
	try {
		const response = await apiClient.get<Report>(`/reports/${id}`);

		const parsed = ReportSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Report inválido desde API");
		}
		return parsed.data;
	} catch (error) {
		// Return null if report not found (404)
		if (error instanceof Error && error.message.includes("404")) {
			return null;
		}
		throw error;
	}
};
