import type {
	VehicleAssignation,
	VehicleAssignationFormData,
} from "@/models/vehicleAssignation";

export interface IVehicleAssignationService {
	listAssignations(): Promise<VehicleAssignation[]>;
	getAssignationById(id: string): Promise<VehicleAssignation | null>;
	getAssignationsByVehicleId(
		vehicleId: string
	): Promise<VehicleAssignation[]>;
	getAssignationsByDriverId(driverId: string): Promise<VehicleAssignation[]>;
	getActiveAssignationByVehicleId(
		vehicleId: string
	): Promise<VehicleAssignation | null>;
	getActiveAssignationByDriverId(
		driverId: string
	): Promise<VehicleAssignation | null>;
	createAssignation(
		data: VehicleAssignationFormData
	): Promise<VehicleAssignation>;
	updateAssignation(
		id: string,
		data: Partial<VehicleAssignationFormData>
	): Promise<VehicleAssignation>;
	deleteAssignation(id: string): Promise<void>;
}
