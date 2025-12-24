import type { Driver } from "@/models";
import { DriverSchema } from "@/models";
import type { IDriverService } from "../interfaces";
import { apiClient } from "./client";

export const listDrivers: IDriverService["listDrivers"] = async () => {
	const response = await apiClient.get<Driver[]>("/drivers");

	const parsed = DriverSchema.array().safeParse(response);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Drivers inválidos desde API");
	}
	return parsed.data;
};

export const getDriverById: IDriverService["getDriverById"] = async (id) => {
	try {
		const response = await apiClient.get<Driver>(`/drivers/${id}`);

		const parsed = DriverSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Driver inválido desde API");
		}
		return parsed.data;
	} catch (error) {
		// Return null if driver not found (404)
		if (error instanceof Error && error.message.includes("404")) {
			return null;
		}
		throw error;
	}
};
