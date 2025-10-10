import raw from "@/assets/mocks/fleet.json";
import type { Vehicle } from "@/models";
import { VehicleSchema } from "@/models";

export async function listFleet(): Promise<Vehicle[]> {
	const parsed = VehicleSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Vehicles mock inválidos");
	}
	return parsed.data;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
	const fleet = await listFleet();
	return fleet.find((vehicle) => vehicle.id === id) || null;
}
