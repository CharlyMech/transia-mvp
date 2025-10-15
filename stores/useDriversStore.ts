import type { Driver } from "@/models";
import { drivers as driversService } from "@/services/data";
import { create } from "zustand";

interface DriversState {
	drivers: Driver[];
	loading: boolean;
	error: string | null;
	initialized: boolean;
}

interface DriversActions {
	fetchDrivers: () => Promise<void>;
	addDriver: (driver: Driver) => void;
	updateDriver: (id: string, updates: Partial<Driver>) => void;
	deleteDriver: (id: string) => void;
	getDriverById: (id: string) => Driver | undefined;
}

type DriversStore = DriversState & DriversActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useDriversStore = create<DriversStore>((set, get) => ({
	drivers: [],
	loading: true,
	error: null,
	initialized: false,

	fetchDrivers: async () => {
		set({ loading: true, error: null });
		try {
			// Add 2 second delay to see skeleton
			await delay(2000);

			const data = await driversService.listDrivers();
			set({ drivers: data, loading: false, initialized: true });
		} catch (error) {
			console.error("Error fetching drivers:", error);
			set({
				error: error instanceof Error ? error.message : "Error desconocido",
				loading: false,
				initialized: true,
			});
		}
	},

	addDriver: (driver) => {
		set((state) => ({
			drivers: [...state.drivers, driver],
		}));
	},

	updateDriver: (id, updates) => {
		set((state) => ({
			drivers: state.drivers.map((driver) =>
				driver.id === id ? { ...driver, ...updates } : driver
			),
		}));
	},

	deleteDriver: (id) => {
		set((state) => ({
			drivers: state.drivers.filter((driver) => driver.id !== id),
		}));
	},

	getDriverById: (id) => {
		return get().drivers.find((driver) => driver.id === id);
	},
}));
