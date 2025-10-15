import type { Report } from "@/models";
import { ReportSchema } from "@/models";
import { supabase } from "./client";

export async function listReports(): Promise<Report[]> {
	const { data, error } = await supabase.from("reports").select("*");
	if (error) throw error;

	const parsed = ReportSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Reports inválidos desde Supabase");
	}
	return parsed.data;
}

export async function getReportById(id: string): Promise<Report | null> {
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
}
