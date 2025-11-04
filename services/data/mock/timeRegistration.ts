import raw from "@/assets/mocks/timeRegistration.json";
import type { TimeRegistration } from "@/models/timeRegistration";
import { TimeRegistrationSchema } from "@/models/timeRegistration";

export async function listTimeRegistrations(): Promise<TimeRegistration[]> {
	const parsed = TimeRegistrationSchema.array().safeParse(raw);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Time registrations mock inválidos");
	}
	return parsed.data;
}

export async function getTimeRegistrationById(
	id: string
): Promise<TimeRegistration | null> {
	const registrations = await listTimeRegistrations();
	return registrations.find((reg) => reg.id === id) || null;
}

export async function getTimeRegistrationsByDriverId(
	driverId: string
): Promise<TimeRegistration[]> {
	const registrations = await listTimeRegistrations();
	return registrations.filter((reg) => reg.driverId === driverId);
}

export async function getTimeRegistrationByDriverAndDate(
	driverId: string,
	date: Date
): Promise<TimeRegistration | null> {
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
}
