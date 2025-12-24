import { z } from "zod";
import { Driver, DriverSchema } from "./driver";

const PASSWORD_VALIDATION_MESSAGES =
	"La contraseña debe tener al menos 6 caracteres";

// Validates if a string is a valid email or phone number
const emailOrPhoneValidator = z.string().min(1, "El teléfono o email es obligatorio").refine(
	(value) => {
		// Email regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// Phone regex (Spanish format: +34, 6/7/9 followed by 8 digits, or international)
		const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{9,}$/;

		return emailRegex.test(value) || phoneRegex.test(value.replace(/\s/g, ''));
	},
	{ message: "Debe ser un email o teléfono válido" }
);

export const LoginCredentialsSchema = z.object({
	identifier: emailOrPhoneValidator,
	password: z.string().min(6, PASSWORD_VALIDATION_MESSAGES),
});

export const AuthResponseSchema = z.object({
	driver: DriverSchema,
	token: z.string(),
	expiresAt: z.string(),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type AuthResponse = {
	driver: Driver;
	token: string;
	expiresAt: string;
};
