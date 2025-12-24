import type {
	VehicleMaintenance,
	VehicleMaintenanceFormData,
} from "@/models/vehicleMaintenance";

/**
 * Vehicle maintenance service interface
 * All vehicle maintenance data providers must implement this interface
 */
export interface IVehicleMaintenanceService {
	/**
	 * Get all vehicle maintenances
	 * @returns List of all vehicle maintenances
	 */
	listMaintenances(): Promise<VehicleMaintenance[]>;

	/**
	 * Get a vehicle maintenance by ID
	 * @param id - Maintenance ID
	 * @returns Maintenance object or null if not found
	 */
	getMaintenanceById(id: string): Promise<VehicleMaintenance | null>;

	/**
	 * Get all maintenances for a specific vehicle
	 * @param vehicleId - Vehicle ID
	 * @returns List of maintenances for the vehicle
	 */
	getMaintenancesByVehicleId(vehicleId: string): Promise<VehicleMaintenance[]>;

	/**
	 * Get maintenances by status
	 * @param status - Maintenance status
	 * @returns List of maintenances with the given status
	 */
	getMaintenancesByStatus(
		status: string
	): Promise<VehicleMaintenance[]>;

	/**
	 * Create a new vehicle maintenance
	 * @param data - Maintenance form data
	 * @returns Created maintenance
	 */
	createMaintenance(
		data: VehicleMaintenanceFormData
	): Promise<VehicleMaintenance>;

	/**
	 * Update an existing vehicle maintenance
	 * @param id - Maintenance ID
	 * @param data - Partial maintenance form data
	 * @returns Updated maintenance
	 */
	updateMaintenance(
		id: string,
		data: Partial<VehicleMaintenanceFormData>
	): Promise<VehicleMaintenance>;

	/**
	 * Delete a vehicle maintenance
	 * @param id - Maintenance ID
	 */
	deleteMaintenance(id: string): Promise<void>;
}
