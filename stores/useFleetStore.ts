import type { Vehicle } from "@/models";
import { fleet as fleetService } from "@/services/data";
import { create } from "zustand";

interface FleetState {
	vehicles: Vehicle[];
	loading: boolean;
	error: string | null;
	initialized: boolean;
}

interface FleetActions {
	fetchFleet: () => Promise<void>;
	addVehicle: (vehicle: Vehicle) => void;
	updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
	deleteVehicle: (id: string) => void;
	getVehicleById: (id: string) => Vehicle | undefined;
}

type FleetStore = FleetState & FleetActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFleetStore = create<FleetStore>((set, get) => ({
	vehicles: [],
	loading: false,
	error: null,
	initialized: false,

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
		}));
	},

	deleteVehicle: (id) => {
		set((state) => ({
			vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
		}));
	},

	getVehicleById: (id) => {
		return get().vehicles.find((vehicle) => vehicle.id === id);
	},
}));
