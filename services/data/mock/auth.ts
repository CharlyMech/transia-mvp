import driversRaw from "@/assets/mocks/drivers.json";
import type { AuthResponse, LoginCredentials } from "@/models/auth";
import { DriverSchema } from "@/models/driver";

// Mock password for testing (in production this would be hashed)
const MOCK_PASSWORD = "123456";

export async function login(
	credentials: LoginCredentials
): Promise<AuthResponse> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const driversResult = DriverSchema.array().safeParse(driversRaw);
		if (!driversResult.success) {
			console.error("Driver validation error:", driversResult.error);
			throw new Error("Error al cargar los datos del sistema");
		}

		const drivers = driversResult.data;

		// For MVP/testing: Always use the first driver from the mock data
		// In production, you would validate credentials properly
		const driver = drivers[0];

		if (!driver) {
			throw new Error("No hay conductores disponibles en el sistema");
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

export async function logout(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 500));
	console.log("Mock logout successful");
}

export async function verifyToken(token: string): Promise<boolean> {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return token.startsWith("mock_token_");
}
