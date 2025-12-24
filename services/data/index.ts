import { isMockMode, isSupabaseMode, isAPIMode } from "@/services/env";

// Mock services
import * as mockAuth from "./mock/auth";
import * as mockDrivers from "./mock/drivers";
import * as mockFleet from "./mock/fleet";
import * as mockReports from "./mock/reports";
import * as mockTimeRegistrations from "./mock/timeRegistration";
import * as mockNotes from "./mock/notes";
import * as mockVehicleMaintenances from "./mock/vehicleMaintenance";
import * as mockVehicleAssignations from "./mock/vehicleAssignation";

// Supabase services
import * as supaAuth from "./supabase/auth";
import * as supaDrivers from "./supabase/drivers";
import * as supaFleet from "./supabase/fleet";
import * as supaReports from "./supabase/reports";
import * as supaTimeRegistrations from "./supabase/timeRegistration";
import * as supaNotes from "./supabase/notes";
import * as supaVehicleMaintenances from "./supabase/vehicleMaintenance";
import * as supaVehicleAssignations from "./supabase/vehicleAssignation";

// API services
import * as apiAuth from "./api/auth";
import * as apiDrivers from "./api/drivers";
import * as apiFleet from "./api/fleet";
import * as apiReports from "./api/reports";
import * as apiTimeRegistrations from "./api/timeRegistration";
import * as apiNotes from "./api/notes";
import * as apiVehicleMaintenances from "./api/vehicleMaintenance";
import * as apiVehicleAssignations from "./api/vehicleAssignation";

/**
 * Service selection based on environment mode
 * Priority: API > Supabase > Mock (default)
 */
export const auth = isAPIMode ? apiAuth : isSupabaseMode ? supaAuth : mockAuth;
export const drivers = isAPIMode
	? apiDrivers
	: isSupabaseMode
		? supaDrivers
		: mockDrivers;
export const fleet = isAPIMode ? apiFleet : isSupabaseMode ? supaFleet : mockFleet;
export const reports = isAPIMode
	? apiReports
	: isSupabaseMode
		? supaReports
		: mockReports;
export const timeRegistrations = isAPIMode
	? apiTimeRegistrations
	: isSupabaseMode
		? supaTimeRegistrations
		: mockTimeRegistrations;
export const notes = isAPIMode ? apiNotes : isSupabaseMode ? supaNotes : mockNotes;
export const vehicleMaintenances = isAPIMode
	? apiVehicleMaintenances
	: isSupabaseMode
		? supaVehicleMaintenances
		: mockVehicleMaintenances;
export const vehicleAssignations = isAPIMode
	? apiVehicleAssignations
	: isSupabaseMode
		? supaVehicleAssignations
		: mockVehicleAssignations;
