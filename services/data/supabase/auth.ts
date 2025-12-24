import type { AuthResponse } from "@/models/auth";
import { AuthResponseSchema } from "@/models/auth";
import { DriverSchema } from "@/models/driver";
import type { IAuthService } from "../interfaces";
import { supabase } from "./client";

export const login: IAuthService["login"] = async (credentials) => {
	try {
		const { data: driverData, error: driverError } = await supabase
			.from("drivers")
			.select("*")
			.or(`phone.eq.${credentials.identifier},email.eq.${credentials.identifier}`)
			.single();

		if (driverError || !driverData) {
			throw new Error(
				"Credenciales incorrectas. Por favor, verifica tus datos."
			);
		}

		const parsedDriver = DriverSchema.safeParse(driverData);
		if (!parsedDriver.success) {
			throw new Error("Error al procesar los datos del usuario");
		}

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email:
					parsedDriver.data.email || `${parsedDriver.data.id}@temp.com`,
				password: credentials.password,
			});

		if (authError) {
			throw new Error(
				"Credenciales incorrectas. Por favor, verifica tus datos."
			);
		}

		if (!authData.session) {
			throw new Error("Error al crear la sesión");
		}

		const authResponse: AuthResponse = {
			driver: parsedDriver.data,
			token: authData.session.access_token,
			expiresAt: new Date(authData.session.expires_at! * 1000).toISOString(),
		};

		return AuthResponseSchema.parse(authResponse);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Error al iniciar sesión. Por favor, intenta de nuevo.");
	}
};

export const logout: IAuthService["logout"] = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
};

export const verifyToken: IAuthService["verifyToken"] = async (token) => {
	const { data, error } = await supabase.auth.getUser(token);
	return !error && !!data.user;
};
