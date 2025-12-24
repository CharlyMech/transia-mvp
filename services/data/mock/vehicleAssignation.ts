import raw from "@/assets/mocks/vehicleAssignation.json";
import type {
	VehicleAssignation,
	VehicleAssignationFormData,
} from "@/models/vehicleAssignation";
import {
	AssignationStatus,
	VehicleAssignationSchema,
} from "@/models/vehicleAssignation";
import * as Crypto from "expo-crypto";
import type { IVehicleAssignationService } from "../interfaces";

// In-memory store for mock (simulates database)
let mockAssignations: VehicleAssignation[] = [];

export const listAssignations: IVehicleAssignationService["listAssignations"] =
	async () => {
		if (mockAssignations.length === 0) {
			const parsed = VehicleAssignationSchema.array().safeParse(raw);
			if (!parsed.success) {
				console.error(parsed.error);
				throw new Error("Vehicle assignations mock inválidos");
			}
			mockAssignations = parsed.data;
		}
		return [...mockAssignations];
	};

export const getAssignationById: IVehicleAssignationService["getAssignationById"] =
	async (id) => {
		const assignations = await listAssignations();
		return assignations.find((a) => a.id === id) || null;
	};

export const getAssignationsByVehicleId: IVehicleAssignationService["getAssignationsByVehicleId"] =
	async (vehicleId) => {
		const assignations = await listAssignations();
		return assignations
			.filter((a) => a.vehicleId === vehicleId)
			.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
	};

export const getAssignationsByDriverId: IVehicleAssignationService["getAssignationsByDriverId"] =
	async (driverId) => {
		const assignations = await listAssignations();
		return assignations
			.filter((a) => a.driverId === driverId)
			.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
	};

export const getActiveAssignationByVehicleId: IVehicleAssignationService["getActiveAssignationByVehicleId"] =
	async (vehicleId) => {
		const assignations = await listAssignations();
		return (
			assignations.find(
				(a) => a.vehicleId === vehicleId && a.status === AssignationStatus.ACTIVE
			) || null
		);
	};

export const getActiveAssignationByDriverId: IVehicleAssignationService["getActiveAssignationByDriverId"] =
	async (driverId) => {
		const assignations = await listAssignations();
		return (
			assignations.find(
				(a) => a.driverId === driverId && a.status === AssignationStatus.ACTIVE
			) || null
		);
	};

export const createAssignation: IVehicleAssignationService["createAssignation"] =
	async (data) => {
		const assignations = await listAssignations();

		const newAssignation: VehicleAssignation = {
			id: Crypto.randomUUID(),
			vehicleId: data.vehicleId,
			driverId: data.driverId,
			status: data.status,
			startDate: new Date(data.startDate),
			endDate: data.endDate ? new Date(data.endDate) : undefined,
			notes: data.notes || undefined,
			startMileage: data.startMileage || undefined,
			endMileage: data.endMileage || undefined,
			createdAt: new Date(),
		};

		const parsed = VehicleAssignationSchema.safeParse(newAssignation);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de asignación inválidos");
		}

		mockAssignations.push(parsed.data);
		return parsed.data;
	};

export const updateAssignation: IVehicleAssignationService["updateAssignation"] =
	async (id, data) => {
		const assignations = await listAssignations();
		const index = assignations.findIndex((a) => a.id === id);

		if (index === -1) {
			throw new Error("Asignación no encontrada");
		}

		const updatedAssignation: VehicleAssignation = {
			...mockAssignations[index],
			...(data.vehicleId && { vehicleId: data.vehicleId }),
			...(data.driverId && { driverId: data.driverId }),
			...(data.status && { status: data.status }),
			...(data.startDate && { startDate: new Date(data.startDate) }),
			...(data.endDate && { endDate: new Date(data.endDate) }),
			...(data.notes !== undefined && { notes: data.notes }),
			...(data.startMileage !== undefined && {
				startMileage: data.startMileage,
			}),
			...(data.endMileage !== undefined && { endMileage: data.endMileage }),
			updatedAt: new Date(),
		};

		const parsed = VehicleAssignationSchema.safeParse(updatedAssignation);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error("Datos de asignación inválidos");
		}

		mockAssignations[index] = parsed.data;
		return parsed.data;
	};

export const deleteAssignation: IVehicleAssignationService["deleteAssignation"] =
	async (id) => {
		const assignations = await listAssignations();
		const index = assignations.findIndex((a) => a.id === id);

		if (index === -1) {
			throw new Error("Asignación no encontrada");
		}

		mockAssignations.splice(index, 1);
	};
