import driversRaw from "@/assets/mocks/drivers.json";
import type { AuthResponse } from "@/models/auth";
import { DriverSchema } from "@/models/driver";
import type { IAuthService } from "../interfaces";

// Mock password for testing (in production this would be hashed)
const MOCK_PASSWORD = "123456";

export const login: IAuthService["login"] = async (credentials) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const driversResult = DriverSchema.array().safeParse(driversRaw);
		if (!driversResult.success) {
			console.error("Driver validation error:", driversResult.error);
			throw new Error("Error al cargar los datos del sistema");
		}

		const drivers = driversResult.data;

		// Find driver by email or phone
		const driver = drivers.find(
			(d) =>
				d.email === credentials.identifier ||
				d.phone === credentials.identifier
		);

		if (!driver) {
			throw new Error(
				"Credenciales incorrectas. Por favor, verifica tus datos."
			);
		}

		if (credentials.password !== MOCK_PASSWORD) {
			throw new Error(
				"Contraseña incorrecta. Por favor, verifica tus datos."
			);
		}

		const token = `mock_token_${driver.id}_${Date.now()}`;
		const expiresAt = new Date(
			Date.now() + 24 * 60 * 60 * 1000
		).toISOString(); // 24 hours

		const authResponse: AuthResponse = {
			driver,
			token,
			expiresAt,
		};

		return authResponse;
	} catch (error) {
		console.error("Auth service error details:", error);

		if (error instanceof Error) {
			throw error;
		}

		throw new Error("Error al iniciar sesión. Por favor, intenta de nuevo.");
	}
}

export const logout: IAuthService["logout"] = async () => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	console.log("Mock logout successful");
};

export const verifyToken: IAuthService["verifyToken"] = async (token) => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return token.startsWith("mock_token_");
};
