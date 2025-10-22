import { z } from "zod";
import { Driver, DriverSchema } from "./driver";

const PASSWORD_VALIDATION_MESSAGES =
	"La contraseña debe tener al menos 6 caracteres";

export const LoginCredentialsSchema = z.object({
	identifier: z.string().min(1, "El campo de identificación es obligatorio"),
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
