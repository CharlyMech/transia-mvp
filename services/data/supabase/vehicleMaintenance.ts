import type {
	VehicleMaintenance,
	VehicleMaintenanceFormData,
} from "@/models/vehicleMaintenance";
import { VehicleMaintenanceSchema } from "@/models/vehicleMaintenance";
import type { IVehicleMaintenanceService } from "../interfaces";
import { supabase } from "./client";

export const listMaintenances: IVehicleMaintenanceService["listMaintenances"] =
	async () => {
		const { data, error } = await supabase
			.from("vehicle_maintenances")
			.select("*");
		if (error) throw error;

		const parsed = VehicleMaintenanceSchema.array().safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenances inválidos desde Supabase");
		}
		return parsed.data;
	};

export const getMaintenanceById: IVehicleMaintenanceService["getMaintenanceById"] =
	async (id) => {
		const { data, error } = await supabase
			.from("vehicle_maintenances")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				// No rows returned
				return null;
			}
			throw error;
		}

		const parsed = VehicleMaintenanceSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenance inválido desde Supabase");
		}
		return parsed.data;
	};

export const getMaintenancesByVehicleId: IVehicleMaintenanceService["getMaintenancesByVehicleId"] =
	async (vehicleId) => {
		const { data, error } = await supabase
			.from("vehicle_maintenances")
			.select("*")
			.eq("vehicleId", vehicleId);

		if (error) throw error;

		const parsed = VehicleMaintenanceSchema.array().safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenances inválidos desde Supabase");
		}
		return parsed.data;
	};

export const getMaintenancesByStatus: IVehicleMaintenanceService["getMaintenancesByStatus"] =
	async (status) => {
		const { data, error } = await supabase
			.from("vehicle_maintenances")
			.select("*")
			.eq("status", status);

		if (error) throw error;

		const parsed = VehicleMaintenanceSchema.array().safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle maintenances inválidos desde Supabase");
		}
		return parsed.data;
	};

export const createMaintenance: IVehicleMaintenanceService["createMaintenance"] =
	async (maintenanceData) => {
		const newMaintenance = {
			vehicleId: maintenanceData.vehicleId,
			maintenanceType: maintenanceData.maintenanceType,
			status: maintenanceData.status,
			scheduledDate: maintenanceData.scheduledDate,
			completedDate: maintenanceData.completedDate || null,
			description: maintenanceData.description || null,
			workshopName: maintenanceData.workshopName || null,
			cost: maintenanceData.cost || null,
			mileage: maintenanceData.mileage || null,
			nextMaintenanceDate: maintenanceData.nextMaintenanceDate || null,
			notes: maintenanceData.notes || null,
			documents: maintenanceData.documents || [],
			createdAt: new Date().toISOString(),
		};

		const { data, error } = await supabase
			.from("vehicle_maintenances")
			.insert([newMaintenance])
			.select()
			.single();

		if (error) throw error;

		const parsed = VehicleMaintenanceSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de mantenimiento inválidos desde Supabase");
		}

		return parsed.data;
	};

export const updateMaintenance: IVehicleMaintenanceService["updateMaintenance"] =
	async (id, maintenanceData) => {
		const updateData: Record<string, unknown> = {
			updatedAt: new Date().toISOString(),
		};

		if (maintenanceData.vehicleId !== undefined)
			updateData.vehicleId = maintenanceData.vehicleId;
		if (maintenanceData.maintenanceType !== undefined)
			updateData.maintenanceType = maintenanceData.maintenanceType;
		if (maintenanceData.status !== undefined)
			updateData.status = maintenanceData.status;
		if (maintenanceData.scheduledDate !== undefined)
			updateData.scheduledDate = maintenanceData.scheduledDate;
		if (maintenanceData.completedDate !== undefined)
			updateData.completedDate = maintenanceData.completedDate;
		if (maintenanceData.description !== undefined)
			updateData.description = maintenanceData.description;
		if (maintenanceData.workshopName !== undefined)
			updateData.workshopName = maintenanceData.workshopName;
		if (maintenanceData.cost !== undefined)
			updateData.cost = maintenanceData.cost;
		if (maintenanceData.mileage !== undefined)
			updateData.mileage = maintenanceData.mileage;
		if (maintenanceData.nextMaintenanceDate !== undefined)
			updateData.nextMaintenanceDate = maintenanceData.nextMaintenanceDate;
		if (maintenanceData.notes !== undefined)
			updateData.notes = maintenanceData.notes;
		if (maintenanceData.documents !== undefined)
			updateData.documents = maintenanceData.documents;

		const { data, error } = await supabase
			.from("vehicle_maintenances")
			.update(updateData)
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;

		const parsed = VehicleMaintenanceSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de mantenimiento inválidos desde Supabase");
		}

		return parsed.data;
	};

export const deleteMaintenance: IVehicleMaintenanceService["deleteMaintenance"] =
	async (id) => {
		const { error } = await supabase
			.from("vehicle_maintenances")
			.delete()
			.eq("id", id);

		if (error) throw error;
	};
