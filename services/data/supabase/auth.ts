import type { AuthResponse, LoginCredentials } from "@/models/auth";
import { AuthResponseSchema } from "@/models/auth";
import { DriverSchema } from "@/models/driver";
import { supabase } from "./client";

export async function login(
	credentials: LoginCredentials
): Promise<AuthResponse> {
	try {
		const { data: driverData, error: driverError } = await supabase
			.from("drivers")
			.select("*")
			.or(
				`phone.eq.${credentials.identifier},email.eq.${credentials.identifier},personId.ilike.${credentials.identifier}`
			)
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
}

export async function logout(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
}

export async function verifyToken(token: string): Promise<boolean> {
	const { data, error } = await supabase.auth.getUser(token);
	return !error && !!data.user;
}
