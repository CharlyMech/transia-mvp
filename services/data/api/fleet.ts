import type { Vehicle } from "@/models";
import { VehicleSchema } from "@/models";
import type { IFleetService } from "../interfaces";
import { apiClient } from "./client";

export const listFleet: IFleetService["listFleet"] = async () => {
	const response = await apiClient.get<Vehicle[]>("/vehicles");

	const parsed = VehicleSchema.array().safeParse(response);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Vehicles inválidos desde API");
	}
	return parsed.data;
};

export const getVehicleById: IFleetService["getVehicleById"] = async (id) => {
	try {
		const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);

		const parsed = VehicleSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle inválido desde API");
		}
		return parsed.data;
	} catch (error) {
		// Return null if vehicle not found (404)
		if (error instanceof Error && error.message.includes("404")) {
			return null;
		}
		throw error;
	}
};
