import type { Vehicle } from "@/models";

/**
 * Fleet service interface
 * All fleet data providers must implement this interface
 */
export interface IFleetService {
	/**
	 * Get all vehicles in the fleet
	 * @returns List of all vehicles
	 */
	listFleet(): Promise<Vehicle[]>;

	/**
	 * Get a vehicle by ID
	 * @param id - Vehicle ID
	 * @returns Vehicle object or null if not found
	 */
	getVehicleById(id: string): Promise<Vehicle | null>;
}
