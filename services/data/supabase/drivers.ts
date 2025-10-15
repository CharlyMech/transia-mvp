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

export async function getDriverById(id: string): Promise<Driver | null> {
	const { data, error } = await supabase
		.from("drivers")
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

	const parsed = DriverSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Driver inválido desde Supabase");
	}
	return parsed.data;
}
