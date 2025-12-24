import raw from "@/assets/mocks/vehicleMaintenance.json";
import type {
	VehicleMaintenance,
	VehicleMaintenanceFormData,
} from "@/models/vehicleMaintenance";
import { VehicleMaintenanceSchema } from "@/models/vehicleMaintenance";
import * as Crypto from "expo-crypto";
import type { IVehicleMaintenanceService } from "../interfaces";

// In-memory store for mock (simulates database)
let mockMaintenances: VehicleMaintenance[] = [];

export const listMaintenances: IVehicleMaintenanceService["listMaintenances"] =
	async () => {
		if (mockMaintenances.length === 0) {
			const parsed = VehicleMaintenanceSchema.array().safeParse(raw);
			if (!parsed.success) {
				console.error(parsed.error);
				throw new Error("Vehicle maintenances mock inválidos");
			}
			mockMaintenances = parsed.data;
		}
		return [...mockMaintenances];
	};

export const getMaintenanceById: IVehicleMaintenanceService["getMaintenanceById"] =
	async (id) => {
		const maintenances = await listMaintenances();
		return maintenances.find((m) => m.id === id) || null;
	};

export const getMaintenancesByVehicleId: IVehicleMaintenanceService["getMaintenancesByVehicleId"] =
	async (vehicleId) => {
		const maintenances = await listMaintenances();
		return maintenances.filter((m) => m.vehicleId === vehicleId);
	};

export const getMaintenancesByStatus: IVehicleMaintenanceService["getMaintenancesByStatus"] =
	async (status) => {
		const maintenances = await listMaintenances();
		return maintenances.filter((m) => m.status === status);
	};

export const createMaintenance: IVehicleMaintenanceService["createMaintenance"] =
	async (data) => {
		const maintenances = await listMaintenances();

		const newMaintenance: VehicleMaintenance = {
			id: Crypto.randomUUID(),
			vehicleId: data.vehicleId,
			maintenanceType: data.maintenanceType,
			status: data.status,
			scheduledDate: new Date(data.scheduledDate),
			completedDate: data.completedDate
				? new Date(data.completedDate)
				: undefined,
			description: data.description || undefined,
			workshopName: data.workshopName || undefined,
			cost: data.cost || undefined,
			mileage: data.mileage || undefined,
			nextMaintenanceDate: data.nextMaintenanceDate
				? new Date(data.nextMaintenanceDate)
				: undefined,
			notes: data.notes || undefined,
			documents: data.documents || [],
			createdAt: new Date(),
		};

		const parsed = VehicleMaintenanceSchema.safeParse(newMaintenance);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de mantenimiento inválidos");
		}

		mockMaintenances.push(parsed.data);
		return parsed.data;
	};

export const updateMaintenance: IVehicleMaintenanceService["updateMaintenance"] =
	async (id, data) => {
		const maintenances = await listMaintenances();
		const index = maintenances.findIndex((m) => m.id === id);

		if (index === -1) {
			throw new Error("Mantenimiento no encontrado");
		}

		const updatedMaintenance: VehicleMaintenance = {
			...mockMaintenances[index],
			...(data.vehicleId && { vehicleId: data.vehicleId }),
			...(data.maintenanceType && { maintenanceType: data.maintenanceType }),
			...(data.status && { status: data.status }),
			...(data.scheduledDate && {
				scheduledDate: new Date(data.scheduledDate),
			}),
			...(data.completedDate && {
				completedDate: new Date(data.completedDate),
			}),
			...(data.description !== undefined && { description: data.description }),
			...(data.workshopName !== undefined && {
				workshopName: data.workshopName,
			}),
			...(data.cost !== undefined && { cost: data.cost }),
			...(data.mileage !== undefined && { mileage: data.mileage }),
			...(data.nextMaintenanceDate && {
				nextMaintenanceDate: new Date(data.nextMaintenanceDate),
			}),
			...(data.notes !== undefined && { notes: data.notes }),
			...(data.documents && { documents: data.documents }),
			updatedAt: new Date(),
		};

		const parsed = VehicleMaintenanceSchema.safeParse(updatedMaintenance);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de mantenimiento inválidos");
		}

		mockMaintenances[index] = parsed.data;
		return parsed.data;
	};

export const deleteMaintenance: IVehicleMaintenanceService["deleteMaintenance"] =
	async (id) => {
		const maintenances = await listMaintenances();
		const index = maintenances.findIndex((m) => m.id === id);

		if (index === -1) {
			throw new Error("Mantenimiento no encontrado");
		}

		mockMaintenances.splice(index, 1);
	};
