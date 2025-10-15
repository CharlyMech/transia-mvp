import type { Vehicle } from "@/models";
import { VehicleSchema } from "@/models";
import { supabase } from "./client";

export async function listFleet(): Promise<Vehicle[]> {
	const { data, error } = await supabase.from("vehicles").select("*");
	if (error) throw error;

	const parsed = VehicleSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Vehicles inválidos desde Supabase");
	}
	return parsed.data;
}
