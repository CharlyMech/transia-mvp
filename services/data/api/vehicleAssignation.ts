import type {
	VehicleAssignation,
	VehicleAssignationFormData,
} from "@/models/vehicleAssignation";
import {
	AssignationStatus,
	VehicleAssignationSchema,
} from "@/models/vehicleAssignation";
import type { IVehicleAssignationService } from "../interfaces";
import { apiClient } from "./client";

export const listAssignations: IVehicleAssignationService["listAssignations"] =
	async () => {
		const response =
			await apiClient.get<VehicleAssignation[]>("/vehicle-assignations");

		const parsed = VehicleAssignationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde API");
		}
		return parsed.data;
	};

export const getAssignationById: IVehicleAssignationService["getAssignationById"] =
	async (id) => {
		try {
			const response = await apiClient.get<VehicleAssignation>(
				`/vehicle-assignations/${id}`
			);

			const parsed = VehicleAssignationSchema.safeParse(response);
			if (!parsed.success) {
				console.error(parsed.error);
				throw new Error("Vehicle assignation inválido desde API");
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

export const getAssignationsByVehicleId: IVehicleAssignationService["getAssignationsByVehicleId"] =
	async (vehicleId) => {
		const response = await apiClient.get<VehicleAssignation[]>(
			`/vehicle-assignations?vehicleId=${vehicleId}`
		);

		const parsed = VehicleAssignationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde API");
		}
		return parsed.data;
	};

export const getAssignationsByDriverId: IVehicleAssignationService["getAssignationsByDriverId"] =
	async (driverId) => {
		const response = await apiClient.get<VehicleAssignation[]>(
			`/vehicle-assignations?driverId=${driverId}`
		);

		const parsed = VehicleAssignationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde API");
		}
		return parsed.data;
	};

export const getActiveAssignationByVehicleId: IVehicleAssignationService["getActiveAssignationByVehicleId"] =
	async (vehicleId) => {
		const response = await apiClient.get<VehicleAssignation[]>(
			`/vehicle-assignations?vehicleId=${vehicleId}&status=${encodeURIComponent(AssignationStatus.ACTIVE)}`
		);

		const parsed = VehicleAssignationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde API");
		}
		return parsed.data.length > 0 ? parsed.data[0] : null;
	};

export const getActiveAssignationByDriverId: IVehicleAssignationService["getActiveAssignationByDriverId"] =
	async (driverId) => {
		const response = await apiClient.get<VehicleAssignation[]>(
			`/vehicle-assignations?driverId=${driverId}&status=${encodeURIComponent(AssignationStatus.ACTIVE)}`
		);

		const parsed = VehicleAssignationSchema.array().safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde API");
		}
		return parsed.data.length > 0 ? parsed.data[0] : null;
	};

export const createAssignation: IVehicleAssignationService["createAssignation"] =
	async (data) => {
		const response = await apiClient.post<VehicleAssignation>(
			"/vehicle-assignations",
			data
		);

		const parsed = VehicleAssignationSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de asignación inválidos desde API");
		}

		return parsed.data;
	};

export const updateAssignation: IVehicleAssignationService["updateAssignation"] =
	async (id, data) => {
		const response = await apiClient.patch<VehicleAssignation>(
			`/vehicle-assignations/${id}`,
			data
		);

		const parsed = VehicleAssignationSchema.safeParse(response);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de asignación inválidos desde API");
		}

		return parsed.data;
	};

export const deleteAssignation: IVehicleAssignationService["deleteAssignation"] =
	async (id) => {
		await apiClient.delete(`/vehicle-assignations/${id}`);
	};
