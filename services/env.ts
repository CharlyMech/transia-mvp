// Supabase configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// API configuration
export const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
export const API_TIMEOUT = Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000;

// Data source mode: "mock" | "supabase" | "api" (with legacy "test" | "prod" support)
export const MODE = (process.env.EXPO_PUBLIC_MODE as
	| "mock"
	| "supabase"
	| "api"
	| "test"
	| "prod") ?? "mock";

// Debug panel flag - solo se activa cuando EXPO_PUBLIC_DEBUG_PANEL=true
export const DEBUG_PANEL_ENABLED =
	process.env.EXPO_PUBLIC_DEBUG_PANEL === "true";

// Data source configuration
export const isMockMode = MODE === "mock" || MODE === "test"; // Support legacy "test"
export const isSupabaseMode = MODE === "supabase" || MODE === "prod"; // Support legacy "prod"
export const isAPIMode = MODE === "api";

// Legacy aliases for backward compatibility
export const isTest = isMockMode;
export const isProd = isSupabaseMode;

// Debugging
const modeDisplay = isMockMode ? "MOCK" : isSupabaseMode ? "SUPABASE" : "API";
const sourceDisplay = isMockMode
	? "Mock data (local)"
	: isSupabaseMode
		? "Supabase (remote)"
		: `API (${API_BASE_URL})`;

console.log("🔧 Environment Mode:", modeDisplay);
console.log("📦 Data Source:", sourceDisplay);
console.log("🛠️ Debug Panel:", DEBUG_PANEL_ENABLED ? "ENABLED" : "DISABLED");
