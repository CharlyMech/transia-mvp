export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

export const MODE = (process.env.EXPO_PUBLIC_MODE as "test" | "prod") ?? "test";

// Debug panel flag - solo se activa cuando EXPO_PUBLIC_DEBUG_PANEL=true
export const DEBUG_PANEL_ENABLED =
	process.env.EXPO_PUBLIC_DEBUG_PANEL === "true";

export const isTest = MODE === "test";
export const isProd = MODE === "prod";

// Debugging
console.log("🔧 Environment Mode:", MODE);
console.log("📦 Using:", isTest ? "MOCK data" : "SUPABASE data");
console.log("🛠️ Debug Panel:", DEBUG_PANEL_ENABLED ? "ENABLED" : "DISABLED");
