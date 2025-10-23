import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * 🔧 HERRAMIENTAS DE LIMPIEZA PARA DATOS CORRUPTOS
 *
 * Úsalas cuando tengas problemas de login en Android
 */

export class StorageCleanupTools {
	/**
	 * NIVEL 1: Limpieza suave - Solo borra auth
	 */
	static async clearAuthOnly(): Promise<void> {
		try {
			console.log("🧹 Limpiando solo datos de autenticación...");
			await AsyncStorage.removeItem("auth-storage");
			console.log("✅ Auth storage borrado");
		} catch (error) {
			console.error("❌ Error limpiando auth:", error);
			throw error;
		}
	}

	/**
	 * NIVEL 2: Limpieza media - Borra todo AsyncStorage
	 */
	static async clearAllStorage(): Promise<void> {
		try {
			console.log("🧹 Limpiando TODO AsyncStorage...");
			await AsyncStorage.clear();
			console.log("✅ AsyncStorage completamente limpio");
		} catch (error) {
			console.error("❌ Error limpiando storage:", error);
			throw error;
		}
	}

	/**
	 * NIVEL 3: Limpieza agresiva - Borra item por item
	 */
	static async nukeStorage(): Promise<void> {
		try {
			console.log("💣 NUKE: Limpieza agresiva iniciada...");

			// Obtener todas las keys
			const keys = await AsyncStorage.getAllKeys();
			console.log(`📋 Encontradas ${keys.length} keys:`, keys);

			// Borrar una por una
			for (const key of keys) {
				try {
					await AsyncStorage.removeItem(key);
					console.log(`✅ Borrado: ${key}`);
				} catch (error) {
					console.error(`❌ Error borrando ${key}:`, error);
				}
			}

			// Verificar que todo esté limpio
			const remainingKeys = await AsyncStorage.getAllKeys();
			if (remainingKeys.length === 0) {
				console.log("✅ NUKE completado - Todo limpio");
			} else {
				console.warn(
					`⚠️ Quedaron ${remainingKeys.length} keys:`,
					remainingKeys
				);
			}
		} catch (error) {
			console.error("❌ Error en NUKE:", error);
			throw error;
		}
	}

	/**
	 * NIVEL 4: Reset completo con validación
	 */
	static async fullReset(): Promise<void> {
		try {
			console.log("🔄 Iniciando reset completo...");

			// 1. Borrar todo
			await this.nukeStorage();

			// 2. Esperar un poco
			await new Promise((resolve) => setTimeout(resolve, 500));

			// 3. Verificar que esté limpio
			const keys = await AsyncStorage.getAllKeys();
			if (keys.length > 0) {
				console.warn(
					"⚠️ Storage no está completamente limpio, reintentando..."
				);
				await this.nukeStorage();
			}

			// 4. Inicializar con datos limpios
			await AsyncStorage.setItem(
				"auth-storage",
				JSON.stringify({
					state: {
						user: null,
						token: null,
						expiresAt: null,
						isAuthenticated: false,
					},
					version: 1,
				})
			);

			console.log("✅ Reset completo exitoso");
		} catch (error) {
			console.error("❌ Error en reset completo:", error);
			throw error;
		}
	}

	/**
	 * 🔍 Diagnóstico - Ver todo el storage
	 */
	static async diagnose(): Promise<Record<string, any>> {
		try {
			console.log("🔍 Iniciando diagnóstico...");

			const keys = await AsyncStorage.getAllKeys();
			const result: Record<string, any> = {
				totalKeys: keys.length,
				keys: keys,
				data: {},
			};

			for (const key of keys) {
				try {
					const value = await AsyncStorage.getItem(key);
					result.data[key] = value ? JSON.parse(value) : value;
				} catch (error) {
					result.data[key] = `ERROR: ${error}`;
				}
			}

			console.log("📊 Diagnóstico completo:", result);
			return result;
		} catch (error) {
			console.error("❌ Error en diagnóstico:", error);
			throw error;
		}
	}

	/**
	 * 🔍 Verificar si el token está expirado
	 */
	static async checkTokenExpiration(): Promise<{
		hasToken: boolean;
		isExpired: boolean;
		expiresAt: string | null;
		timeRemaining: string | null;
	}> {
		try {
			const authData = await AsyncStorage.getItem("auth-storage");

			if (!authData) {
				return {
					hasToken: false,
					isExpired: true,
					expiresAt: null,
					timeRemaining: null,
				};
			}

			const parsed = JSON.parse(authData);
			const expiresAt = parsed?.state?.expiresAt;

			if (!expiresAt) {
				return {
					hasToken: false,
					isExpired: true,
					expiresAt: null,
					timeRemaining: null,
				};
			}

			const expirationDate = new Date(expiresAt);
			const now = new Date();
			const isExpired = expirationDate <= now;

			// Calcular tiempo restante
			const diffMs = expirationDate.getTime() - now.getTime();
			const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
			const diffMinutes = Math.floor(
				(diffMs % (1000 * 60 * 60)) / (1000 * 60)
			);

			const timeRemaining = isExpired
				? "Expirado"
				: `${diffHours}h ${diffMinutes}m`;

			console.log("🕐 Token info:", {
				hasToken: true,
				isExpired,
				expiresAt,
				timeRemaining,
			});

			return {
				hasToken: true,
				isExpired,
				expiresAt,
				timeRemaining,
			};
		} catch (error) {
			console.error("❌ Error verificando token:", error);
			return {
				hasToken: false,
				isExpired: true,
				expiresAt: null,
				timeRemaining: null,
			};
		}
	}

	/**
	 * 🚨 Solo para Android - Auto-limpieza en startup si hay problemas
	 */
	static async autoCleanupIfCorrupted(): Promise<boolean> {
		if (Platform.OS !== "android") {
			return false;
		}

		try {
			const authData = await AsyncStorage.getItem("auth-storage");

			// Si no hay datos, no hay problema
			if (!authData) {
				return false;
			}

			// Intentar parsear los datos
			try {
				const parsed = JSON.parse(authData);

				// Verificar estructura básica
				if (!parsed.state) {
					console.warn("⚠️ Estructura de datos inválida detectada");
					await this.fullReset();
					return true;
				}

				// Verificar que los campos críticos tengan el tipo correcto
				const { isAuthenticated, token, expiresAt } = parsed.state;

				if (
					typeof isAuthenticated !== "boolean" ||
					(token !== null && typeof token !== "string") ||
					(expiresAt !== null && typeof expiresAt !== "string")
				) {
					console.warn("⚠️ Tipos de datos incorrectos detectados");
					await this.fullReset();
					return true;
				}

				return false;
			} catch (parseError) {
				console.error("❌ Datos corruptos detectados:", parseError);
				await this.fullReset();
				return true;
			}
		} catch (error) {
			console.error("❌ Error en auto-cleanup:", error);
			return false;
		}
	}
}

/**
 * 🎯 GUÍA DE USO RÁPIDA
 *
 * // Nivel 1: Solo auth
 * await StorageCleanupTools.clearAuthOnly();
 *
 * // Nivel 2: Todo el storage
 * await StorageCleanupTools.clearAllStorage();
 *
 * // Nivel 3: Limpieza agresiva
 * await StorageCleanupTools.nukeStorage();
 *
 * // Nivel 4: Reset completo
 * await StorageCleanupTools.fullReset();
 *
 * // Diagnóstico
 * const diag = await StorageCleanupTools.diagnose();
 * console.log(diag);
 *
 * // Ver token
 * const tokenInfo = await StorageCleanupTools.checkTokenExpiration();
 * console.log(tokenInfo);
 *
 * // Auto-limpieza al inicio (poner en _layout.tsx)
 * const wasCorrupted = await StorageCleanupTools.autoCleanupIfCorrupted();
 */
