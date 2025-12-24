import type { TimeRegistration } from "@/models/timeRegistration";
import { TimeRegistrationSchema } from "@/models/timeRegistration";
import type { ITimeRegistrationService } from "../interfaces";
import { apiClient } from "./client";

export const listTimeRegistrations: ITimeRegistrationService["listTimeRegistrations"] =
	async () => {
		const response = await apiClient.get<TimeRegistration[]>(
			"/time-registrations"
		);

		const parsed = TimeRegistrationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Time registrations inválidos desde API");
		}
		return parsed.data;
	};

export const getTimeRegistrationById: ITimeRegistrationService["getTimeRegistrationById"] =
	async (id) => {
		try {
			const response = await apiClient.get<TimeRegistration>(
				`/time-registrations/${id}`
			);

			const parsed = TimeRegistrationSchema.safeParse(response);
			if (!parsed.success) {
				console.error(parsed.error);
				throw new Error("Time registration inválido desde API");
			}
			return parsed.data;
		} catch (error) {
			// Return null if not found (404)
			if (error instanceof Error && error.message.includes("404")) {
				return null;
			}
			throw error;
		}
	};

export const getTimeRegistrationsByDriverId: ITimeRegistrationService["getTimeRegistrationsByDriverId"] =
	async (driverId) => {
		const response = await apiClient.get<TimeRegistration[]>(
			`/time-registrations?driverId=${driverId}`
		);

		const parsed = TimeRegistrationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Time registrations inválidos desde API");
		}
		return parsed.data;
	};

export const getTimeRegistrationByDriverAndDate: ITimeRegistrationService["getTimeRegistrationByDriverAndDate"] =
	async (driverId, date) => {
		try {
			const dateStr = date.toISOString().split("T")[0];
			const response = await apiClient.get<TimeRegistration>(
				`/time-registrations?driverId=${driverId}&date=${dateStr}`
			);

			const parsed = TimeRegistrationSchema.safeParse(response);
			if (!parsed.success) {
				console.error(parsed.error);
				throw new Error("Time registration inválido desde API");
			}
			return parsed.data;
		} catch (error) {
			// Return null if not found (404)
			if (error instanceof Error && error.message.includes("404")) {
				return null;
			}
			throw error;
		}
	};
