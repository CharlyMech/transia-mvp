import { SUPABASE_ANON_KEY, SUPABASE_URL, isTest } from "@/services/env";
import { createClient } from "@supabase/supabase-js";

// Only create the client if we are not in test mode and the variables are defined
export const supabase =
	!isTest && SUPABASE_URL && SUPABASE_ANON_KEY
		? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
		: createClient("https://placeholder.supabase.co", "placeholder-key"); // Dummy client for test mode
