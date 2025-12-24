import { TimeRegistrationSchema } from "@/models/timeRegistration";
import type { ITimeRegistrationService } from "../interfaces";
import { supabase } from "./client";

export const listTimeRegistrations: ITimeRegistrationService["listTimeRegistrations"] =
	async () => {
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
	};

export const getTimeRegistrationById: ITimeRegistrationService["getTimeRegistrationById"] =
	async (id) => {
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
	};

export const getTimeRegistrationsByDriverId: ITimeRegistrationService["getTimeRegistrationsByDriverId"] =
	async (driverId) => {
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
	};

export const getTimeRegistrationByDriverAndDate: ITimeRegistrationService["getTimeRegistrationByDriverAndDate"] =
	async (driverId, date) => {
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
	};
