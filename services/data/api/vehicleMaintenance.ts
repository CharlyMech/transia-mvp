import type {
	VehicleMaintenance,
	VehicleMaintenanceFormData,
} from "@/models/vehicleMaintenance";
import { VehicleMaintenanceSchema } from "@/models/vehicleMaintenance";
import type { IVehicleMaintenanceService } from "../interfaces";
import { apiClient } from "./client";

export const listMaintenances: IVehicleMaintenanceService["listMaintenances"] =
	async () => {
		const response = await apiClient.get<VehicleMaintenance[]>(
			"/vehicle-maintenances"
		);

		const parsed = VehicleMaintenanceSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenances inválidos desde API");
		}
		return parsed.data;
	};

export const getMaintenanceById: IVehicleMaintenanceService["getMaintenanceById"] =
	async (id) => {
		try {
			const response = await apiClient.get<VehicleMaintenance>(
				`/vehicle-maintenances/${id}`
			);

			const parsed = VehicleMaintenanceSchema.safeParse(response);
			if (!parsed.success) {
				console.error(parsed.error);
				throw new Error("Vehicle maintenance inválido desde API");
			}
			return parsed.data;
		} catch (error) {
			// Return null if not found (404)
			if (error instanceof Error && error.message.includes("404")) {
				return null;
			}
			throw error;
		}
	};

export const getMaintenancesByVehicleId: IVehicleMaintenanceService["getMaintenancesByVehicleId"] =
	async (vehicleId) => {
		const response = await apiClient.get<VehicleMaintenance[]>(
			`/vehicle-maintenances?vehicleId=${vehicleId}`
		);

		const parsed = VehicleMaintenanceSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenances inválidos desde API");
		}
		return parsed.data;
	};

export const getMaintenancesByStatus: IVehicleMaintenanceService["getMaintenancesByStatus"] =
	async (status) => {
		const response = await apiClient.get<VehicleMaintenance[]>(
			`/vehicle-maintenances?status=${encodeURIComponent(status)}`
		);

		const parsed = VehicleMaintenanceSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenances inválidos desde API");
		}
		return parsed.data;
	};

export const createMaintenance: IVehicleMaintenanceService["createMaintenance"] =
	async (data) => {
		const response = await apiClient.post<VehicleMaintenance>(
			"/vehicle-maintenances",
			data
		);

		const parsed = VehicleMaintenanceSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de mantenimiento inválidos desde API");
		}

		return parsed.data;
	};

export const updateMaintenance: IVehicleMaintenanceService["updateMaintenance"] =
	async (id, data) => {
		const response = await apiClient.patch<VehicleMaintenance>(
			`/vehicle-maintenances/${id}`,
			data
		);

		const parsed = VehicleMaintenanceSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de mantenimiento inválidos desde API");
		}

		return parsed.data;
	};

export const deleteMaintenance: IVehicleMaintenanceService["deleteMaintenance"] =
	async (id) => {
		await apiClient.delete(`/vehicle-maintenances/${id}`);
	};
