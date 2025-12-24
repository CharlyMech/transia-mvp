import type { AuthResponse, LoginCredentials } from "@/models/auth";

/**
 * Authentication service interface
 * All authentication providers must implement this interface
 */
export interface IAuthService {
	/**
	 * Authenticate a user with credentials
	 * @param credentials - User login credentials
	 * @returns Authentication response with driver data and token
	 */
	login(credentials: LoginCredentials): Promise<AuthResponse>;

	/**
	 * Logout the current user
	 */
	logout(): Promise<void>;

	/**
	 * Verify if a token is valid
	 * @param token - Authentication token to verify
	 * @returns true if token is valid, false otherwise
	 */
	verifyToken(token: string): Promise<boolean>;
}
