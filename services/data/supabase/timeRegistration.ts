import type { TimeRegistration } from "@/models/timeRegistration";
import { TimeRegistrationSchema } from "@/models/timeRegistration";
import { supabase } from "./client";

export async function listTimeRegistrations(): Promise<TimeRegistration[]> {
	const { data, error } = await supabase
		.from("time_registrations")
		.select("*");
	if (error) throw error;

	const parsed = TimeRegistrationSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Time registrations inválidos desde Supabase");
	}
	return parsed.data;
}

export async function getTimeRegistrationById(
	id: string
): Promise<TimeRegistration | null> {
	const { data, error } = await supabase
		.from("time_registrations")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			return null;
		}
		throw error;
	}

	const parsed = TimeRegistrationSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Time registration inválido desde Supabase");
	}
	return parsed.data;
}

export async function getTimeRegistrationsByDriverId(
	driverId: string
): Promise<TimeRegistration[]> {
	const { data, error } = await supabase
		.from("time_registrations")
		.select("*")
		.eq("driverId", driverId);

	if (error) throw error;

	const parsed = TimeRegistrationSchema.array().safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Time registrations inválidos desde Supabase");
	}
	return parsed.data;
}

export async function getTimeRegistrationByDriverAndDate(
	driverId: string,
	date: Date
): Promise<TimeRegistration | null> {
	const dateStr = date.toISOString().split("T")[0];

	const { data, error } = await supabase
		.from("time_registrations")
		.select("*")
		.eq("driverId", driverId)
		.gte("date", `${dateStr}T00:00:00.000Z`)
		.lt("date", `${dateStr}T23:59:59.999Z`)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			return null;
		}
		throw error;
	}

	const parsed = TimeRegistrationSchema.safeParse(data);
	if (!parsed.success) {
		console.error(parsed.error);
		throw new Error("Time registration inválido desde Supabase");
	}
	return parsed.data;
}
