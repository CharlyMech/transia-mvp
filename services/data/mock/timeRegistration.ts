import raw from "@/assets/mocks/timeRegistration.json";
import { TimeRegistrationSchema } from "@/models/timeRegistration";
import type { ITimeRegistrationService } from "../interfaces";

export const listTimeRegistrations: ITimeRegistrationService["listTimeRegistrations"] =
	async () => {
		const parsed = TimeRegistrationSchema.array().safeParse(raw);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Time registrations mock inválidos");
		}
		return parsed.data;
	};

export const getTimeRegistrationById: ITimeRegistrationService["getTimeRegistrationById"] =
	async (id) => {
		const registrations = await listTimeRegistrations();
		return registrations.find((reg) => reg.id === id) || null;
	};

export const getTimeRegistrationsByDriverId: ITimeRegistrationService["getTimeRegistrationsByDriverId"] =
	async (driverId) => {
		const registrations = await listTimeRegistrations();
		return registrations.filter((reg) => reg.driverId === driverId);
	};

export const getTimeRegistrationByDriverAndDate: ITimeRegistrationService["getTimeRegistrationByDriverAndDate"] =
	async (driverId, date) => {
		const registrations = await listTimeRegistrations();
		const targetDate = new Date(date);
		targetDate.setHours(0, 0, 0, 0);

		return (
			registrations.find((reg) => {
				const regDate = new Date(reg.date);
				regDate.setHours(0, 0, 0, 0);
				return (
					reg.driverId === driverId &&
					regDate.getTime() === targetDate.getTime()
				);
			}) || null
		);
	};
