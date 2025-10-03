export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const MODE = (process.env.EXPO_PUBLIC_MODE as "test" | "prod") ?? "prod";

export const isTest = MODE === "test";
export const isProd = MODE === "prod";
