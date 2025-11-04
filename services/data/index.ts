import { isTest } from "@/services/env";

import * as mockAuth from "./mock/auth";
import * as mockDrivers from "./mock/drivers";
import * as mockFleet from "./mock/fleet";
import * as mockReports from "./mock/reports";
import * as mockTimeRegistrations from "./mock/timeRegistration";

import * as supaAuth from "./supabase/auth";
import * as supaDrivers from "./supabase/drivers";
import * as supaFleet from "./supabase/fleet";
import * as supaReports from "./supabase/reports";
import * as supaTimeRegistrations from "./supabase/timeRegistration";

export const auth = isTest ? mockAuth : supaAuth;
export const drivers = isTest ? mockDrivers : supaDrivers;
export const fleet = isTest ? mockFleet : supaFleet;
export const reports = isTest ? mockReports : supaReports;
export const timeRegistrations = isTest
	? mockTimeRegistrations
	: supaTimeRegistrations;
