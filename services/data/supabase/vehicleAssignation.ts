import type {
	VehicleAssignation,
	VehicleAssignationFormData,
} from "@/models/vehicleAssignation";
import {
	AssignationStatus,
	VehicleAssignationSchema,
} from "@/models/vehicleAssignation";
import type { IVehicleAssignationService } from "../interfaces";
import { supabase } from "./client";

export const listAssignations: IVehicleAssignationService["listAssignations"] =
	async () => {
		const { data, error } = await supabase
			.from("vehicle_assignations")
			.select("*")
			.order("startDate", { ascending: false });
		if (error) throw error;

		const parsed = VehicleAssignationSchema.array().safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde Supabase");
		}
		return parsed.data;
	};

export const getAssignationById: IVehicleAssignationService["getAssignationById"] =
	async (id) => {
		const { data, error } = await supabase
			.from("vehicle_assignations")
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

		const parsed = VehicleAssignationSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignation inválido desde Supabase");
		}
		return parsed.data;
	};

export const getAssignationsByVehicleId: IVehicleAssignationService["getAssignationsByVehicleId"] =
	async (vehicleId) => {
		const { data, error } = await supabase
			.from("vehicle_assignations")
			.select("*")
			.eq("vehicleId", vehicleId)
			.order("startDate", { ascending: false });

		if (error) throw error;

		const parsed = VehicleAssignationSchema.array().safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde Supabase");
		}
		return parsed.data;
	};

export const getAssignationsByDriverId: IVehicleAssignationService["getAssignationsByDriverId"] =
	async (driverId) => {
		const { data, error } = await supabase
			.from("vehicle_assignations")
			.select("*")
			.eq("driverId", driverId)
			.order("startDate", { ascending: false });

		if (error) throw error;

		const parsed = VehicleAssignationSchema.array().safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignations inválidos desde Supabase");
		}
		return parsed.data;
	};

export const getActiveAssignationByVehicleId: IVehicleAssignationService["getActiveAssignationByVehicleId"] =
	async (vehicleId) => {
		const { data, error } = await supabase
			.from("vehicle_assignations")
			.select("*")
			.eq("vehicleId", vehicleId)
			.eq("status", AssignationStatus.ACTIVE)
			.maybeSingle();

		if (error) throw error;

		if (!data) return null;

		const parsed = VehicleAssignationSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignation inválido desde Supabase");
		}
		return parsed.data;
	};

export const getActiveAssignationByDriverId: IVehicleAssignationService["getActiveAssignationByDriverId"] =
	async (driverId) => {
		const { data, error } = await supabase
			.from("vehicle_assignations")
			.select("*")
			.eq("driverId", driverId)
			.eq("status", AssignationStatus.ACTIVE)
			.maybeSingle();

		if (error) throw error;

		if (!data) return null;

		const parsed = VehicleAssignationSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Vehicle assignation inválido desde Supabase");
		}
		return parsed.data;
	};

export const createAssignation: IVehicleAssignationService["createAssignation"] =
	async (assignationData) => {
		const newAssignation = {
			vehicleId: assignationData.vehicleId,
			driverId: assignationData.driverId,
			status: assignationData.status,
			startDate: assignationData.startDate,
			endDate: assignationData.endDate || null,
			notes: assignationData.notes || null,
			startMileage: assignationData.startMileage || null,
			endMileage: assignationData.endMileage || null,
			createdAt: new Date().toISOString(),
		};

		const { data, error } = await supabase
			.from("vehicle_assignations")
			.insert([newAssignation])
			.select()
			.single();

		if (error) throw error;

		const parsed = VehicleAssignationSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de asignación inválidos desde Supabase");
		}

		return parsed.data;
	};

export const updateAssignation: IVehicleAssignationService["updateAssignation"] =
	async (id, assignationData) => {
		const updateData: Record<string, unknown> = {
			updatedAt: new Date().toISOString(),
		};

		if (assignationData.vehicleId !== undefined)
			updateData.vehicleId = assignationData.vehicleId;
		if (assignationData.driverId !== undefined)
			updateData.driverId = assignationData.driverId;
		if (assignationData.status !== undefined)
			updateData.status = assignationData.status;
		if (assignationData.startDate !== undefined)
			updateData.startDate = assignationData.startDate;
		if (assignationData.endDate !== undefined)
			updateData.endDate = assignationData.endDate;
		if (assignationData.notes !== undefined)
			updateData.notes = assignationData.notes;
		if (assignationData.startMileage !== undefined)
			updateData.startMileage = assignationData.startMileage;
		if (assignationData.endMileage !== undefined)
			updateData.endMileage = assignationData.endMileage;

		const { data, error } = await supabase
			.from("vehicle_assignations")
			.update(updateData)
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;

		const parsed = VehicleAssignationSchema.safeParse(data);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de asignación inválidos desde Supabase");
		}

		return parsed.data;
	};

export const deleteAssignation: IVehicleAssignationService["deleteAssignation"] =
	async (id) => {
		const { error } = await supabase
			.from("vehicle_assignations")
			.delete()
			.eq("id", id);

		if (error) throw error;
	};
