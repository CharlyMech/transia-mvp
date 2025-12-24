import { VehicleSchema } from "@/models";
import type { IFleetService } from "../interfaces";
import { supabase } from "./client";

export const listFleet: IFleetService["listFleet"] = async () => {
	const { data, error } = await supabase.from("vehicles").select("*");
	if (error) throw error;

	const parsed = VehicleSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Vehicles inválidos desde Supabase");
	}
	return parsed.data;
};

export const getVehicleById: IFleetService["getVehicleById"] = async (id) => {
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
};
