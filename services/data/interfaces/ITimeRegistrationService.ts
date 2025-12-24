import type { TimeRegistration } from "@/models/timeRegistration";

/**
 * Time registration service interface
 * All time registration data providers must implement this interface
 */
export interface ITimeRegistrationService {
	/**
	 * Get all time registrations
	 * @returns List of all time registrations
	 */
	listTimeRegistrations(): Promise<TimeRegistration[]>;

	/**
	 * Get a time registration by ID
	 * @param id - Time registration ID
	 * @returns Time registration object or null if not found
	 */
	getTimeRegistrationById(id: string): Promise<TimeRegistration | null>;

	/**
	 * Get time registrations for a specific driver
	 * @param driverId - Driver ID
	 * @returns List of time registrations for the driver
	 */
	getTimeRegistrationsByDriverId(driverId: string): Promise<TimeRegistration[]>;

	/**
	 * Get time registration for a specific driver on a specific date
	 * @param driverId - Driver ID
	 * @param date - Target date
	 * @returns Time registration object or null if not found
	 */
	getTimeRegistrationByDriverAndDate(
		driverId: string,
		date: Date
	): Promise<TimeRegistration | null>;
}
