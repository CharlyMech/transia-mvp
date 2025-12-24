import type { AuthResponse } from "@/models/auth";
import { AuthResponseSchema } from "@/models/auth";
import type { IAuthService } from "../interfaces";
import { apiClient } from "./client";

export const login: IAuthService["login"] = async (credentials) => {
	try {
		const response = await apiClient.post<AuthResponse>("/auth/login", {
			identifier: credentials.identifier,
			password: credentials.password,
		});

		// Validate response
		const validatedResponse = AuthResponseSchema.parse(response);

		// Store auth token for subsequent requests
		apiClient.setAuthToken(validatedResponse.token);

		return validatedResponse;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Error al iniciar sesión. Por favor, intenta de nuevo.");
	}
};

export const logout: IAuthService["logout"] = async () => {
	try {
		await apiClient.post("/auth/logout");
		// Clear auth token
		apiClient.setAuthToken(null);
	} catch (error) {
		// Even if the API call fails, clear the token locally
		apiClient.setAuthToken(null);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Error al cerrar sesión");
	}
};

export const verifyToken: IAuthService["verifyToken"] = async (token) => {
	try {
		const response = await apiClient.post<{ valid: boolean }>(
			"/auth/verify",
			{ token }
		);
		return response.valid;
	} catch (error) {
		console.error("Token verification failed:", error);
		return false;
	}
};
