import type { Driver } from "@/models";

/**
 * Driver service interface
 * All driver data providers must implement this interface
 */
export interface IDriverService {
	/**
	 * Get all drivers
	 * @returns List of all drivers
	 */
	listDrivers(): Promise<Driver[]>;

	/**
	 * Get a driver by ID
	 * @param id - Driver ID
	 * @returns Driver object or null if not found
	 */
	getDriverById(id: string): Promise<Driver | null>;
}
