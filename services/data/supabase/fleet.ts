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

export async function getVehicleById(id: string): Promise<Vehicle | null> {
	const { data, error } = await supabase
		.from("vehicles")
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

	const parsed = VehicleSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Vehicle inválido desde Supabase");
	}
	return parsed.data;
}
