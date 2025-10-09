import raw from "@/assets/mocks/drivers.json";
import type { Driver } from "@/models";
import { DriverSchema } from "@/models";

export async function listDrivers(): Promise<Driver[]> {
	const parsed = DriverSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Drivers mock inválidos");
	}
	return parsed.data;
}

export async function getDriverById(id: string): Promise<Driver | null> {
	const drivers = await listDrivers();
	return drivers.find((driver) => driver.id === id) || null;
}
