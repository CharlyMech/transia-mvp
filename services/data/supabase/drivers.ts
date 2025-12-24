import { DriverSchema } from "@/models";
import type { IDriverService } from "../interfaces";
import { supabase } from "./client";

export const listDrivers: IDriverService["listDrivers"] = async () => {
	const { data, error } = await supabase.from("drivers").select("*");
	if (error) throw error;

	const parsed = DriverSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Drivers inválidos desde Supabase");
	}
	return parsed.data;
};

export const getDriverById: IDriverService["getDriverById"] = async (id) => {
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
};
