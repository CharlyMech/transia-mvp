import type { AuthResponse, LoginCredentials } from "@/models/auth";
import type { Driver } from "@/models/driver";
import { auth as authService } from "@/services/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
	// User data
	user: Driver | null;
	token: string | null;
	expiresAt: string | null;

	// UI State
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	isInitialized: boolean;
}

interface AuthActions {
	// Auth operations
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
	clearError: () => void;

	// Token management
	isTokenExpired: () => boolean;
	refreshAuth: () => Promise<void>;

	// Initialization
	initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			token: null,
			expiresAt: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			isInitialized: false,

			login: async (credentials: LoginCredentials) => {
				set({ isLoading: true, error: null });
				try {
					// Add 2 second delay for loading state
					await delay(2000);

					const response: AuthResponse = await authService.login(
						credentials
					);

					set({
						user: response.driver,
						token: response.token,
						expiresAt: response.expiresAt,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					});
				} catch (error) {
					// Log detailed error for debugging
					console.error("Login error details:", error);

					// Show user-friendly message
					let userMessage =
						"No se pudo iniciar sesión. Por favor, intenta de nuevo.";

					if (error instanceof Error) {
						// If it's a known error message, show it
						if (
							error.message.includes("Credenciales incorrectas") ||
							error.message.includes("No hay conductores")
						) {
							userMessage = error.message;
						}
					}

					set({
						user: null,
						token: null,
						expiresAt: null,
						isAuthenticated: false,
						isLoading: false,
						error: userMessage,
					});
					throw error;
				}
			},

			logout: () => {
				set({
					user: null,
					token: null,
					expiresAt: null,
					isAuthenticated: false,
					isLoading: false,
					error: null,
				});
			},

			clearError: () => {
				set({ error: null });
			},

			isTokenExpired: () => {
				const { expiresAt } = get();
				if (!expiresAt) return true;

				const expirationDate = new Date(expiresAt);
				return expirationDate <= new Date();
			},

			refreshAuth: async () => {
				const { token, isTokenExpired, logout } = get();

				if (!token) {
					logout();
					return;
				}

				if (isTokenExpired()) {
					console.log("Token expired, logging out");
					logout();
					return;
				}

				// Token is still valid
				console.log("Token is still valid");
			},

			initialize: () => {
				const { refreshAuth } = get();
				refreshAuth();
				set({ isInitialized: true });
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			// Only persist certain fields
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				expiresAt: state.expiresAt,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
