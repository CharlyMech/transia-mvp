import { ReportSchema } from "@/models";
import type { IReportService } from "../interfaces";
import { supabase } from "./client";

export const listReports: IReportService["listReports"] = async () => {
	const { data, error } = await supabase.from("reports").select("*");
	if (error) throw error;

	const parsed = ReportSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Reports inválidos desde Supabase");
	}
	return parsed.data;
};

export const getReportById: IReportService["getReportById"] = async (id) => {
	const { data, error } = await supabase
		.from("reports")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// No rows returned
			return null;
		}
		throw error;
	}

	const parsed = ReportSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Report inválido desde Supabase");
	}
	return parsed.data;
};
