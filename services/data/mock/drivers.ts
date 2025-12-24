import raw from "@/assets/mocks/drivers.json";
import { DriverSchema } from "@/models";
import type { IDriverService } from "../interfaces";

export const listDrivers: IDriverService["listDrivers"] = async () => {
	const parsed = DriverSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Drivers mock inválidos");
	}
	return parsed.data;
};

export const getDriverById: IDriverService["getDriverById"] = async (id) => {
	const drivers = await listDrivers();
	return drivers.find((driver) => driver.id === id) || null;
};
