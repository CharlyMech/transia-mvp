import raw from "@/assets/mocks/fleet.json";
import { VehicleSchema } from "@/models";
import type { IFleetService } from "../interfaces";

export const listFleet: IFleetService["listFleet"] = async () => {
	const parsed = VehicleSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Vehicles mock inválidos");
	}
	return parsed.data;
};

export const getVehicleById: IFleetService["getVehicleById"] = async (id) => {
	const fleet = await listFleet();
	return fleet.find((vehicle) => vehicle.id === id) || null;
};
