import type { Vehicle } from "@/models";
import { fleet as fleetService } from "@/services/data";
import { create } from "zustand";

interface FleetState {
	// Global
	vehicles: Vehicle[];
	loading: boolean;
	error: string | null;
	initialized: boolean;

	// Current vehicle
	currentVehicle: Vehicle | null;
	loadingVehicle: boolean;
	vehicleError: string | null;
}

interface FleetActions {
	fetchFleet: () => Promise<void>;
	fetchVehicleById: (id: string) => Promise<void>;
	addVehicle: (vehicle: Vehicle) => void;
	updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
	deleteVehicle: (id: string) => void;
	clearCurrentVehicle: () => void;
}

type FleetStore = FleetState & FleetActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFleetStore = create<FleetStore>((set, get) => ({
	// Global
	vehicles: [],
	loading: false,
	error: null,
	initialized: false,

	// Current vehicle
	currentVehicle: null,
	loadingVehicle: false,
	vehicleError: null,

	fetchFleet: async () => {
		set({ loading: true, error: null });
		try {
			// Add 2 second delay to see skeleton
			await delay(2000);

			const data = await fleetService.listFleet();
			set({ vehicles: data, loading: false, initialized: true });
		} catch (error) {
			console.error("Error fetching fleet:", error);
			set({
				error: error instanceof Error ? error.message : "Error desconocido",
				loading: false,
				initialized: true,
			});
		}
	},

	fetchVehicleById: async (id: string) => {
		set({ loadingVehicle: true, vehicleError: null, currentVehicle: null });
		try {
			// Add 1.5 second delay to see skeleton
			await delay(1500);

			// First search in local store
			let vehicle = get().vehicles.find((v) => v.id === id);

			// If not found, search in service
			if (!vehicle) {
				const fetchedVehicle = await fleetService.getVehicleById(id);
				if (fetchedVehicle) {
					vehicle = fetchedVehicle;
				}
			}

			if (!vehicle) {
				throw new Error("Vehículo no encontrado");
			}

			set({ currentVehicle: vehicle, loadingVehicle: false });
		} catch (error) {
			console.error("Error fetching vehicle:", error);
			set({
				vehicleError:
					error instanceof Error ? error.message : "Error desconocido",
				loadingVehicle: false,
			});
		}
	},

	clearCurrentVehicle: () => {
		set({ currentVehicle: null, loadingVehicle: false, vehicleError: null });
	},

	addVehicle: (vehicle) => {
		set((state) => ({
			vehicles: [...state.vehicles, vehicle],
		}));
	},

	updateVehicle: (id, updates) => {
		set((state) => ({
			vehicles: state.vehicles.map((vehicle) =>
				vehicle.id === id ? { ...vehicle, ...updates } : vehicle
			),
			currentVehicle:
				state.currentVehicle?.id === id
					? { ...state.currentVehicle, ...updates }
					: state.currentVehicle,
		}));
	},

	deleteVehicle: (id) => {
		set((state) => ({
			vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
		}));
	},
}));
