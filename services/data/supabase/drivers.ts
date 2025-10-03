import type { Driver } from "@/models";
import { DriverSchema } from "@/models";
import { supabase } from "./client";

export async function listDrivers(): Promise<Driver[]> {
	const { data, error } = await supabase.from("drivers").select("*");
	if (error) throw error;

	const parsed = DriverSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Drivers inválidos desde Supabase");
	}
	return parsed.data;
}
