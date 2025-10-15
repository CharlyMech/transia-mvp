import type { Driver } from "@/models";
import { drivers as driversService } from "@/services/data";
import { create } from "zustand";

interface DriversState {
	// Global
	drivers: Driver[];
	loading: boolean;
	error: string | null;
	initialized: boolean;

	// Current driver
	currentDriver: Driver | null;
	loadingDriver: boolean;
	driverError: string | null;
}

interface DriversActions {
	fetchDrivers: () => Promise<void>;
	fetchDriverById: (id: string) => Promise<void>;
	addDriver: (driver: Driver) => void;
	updateDriver: (id: string, updates: Partial<Driver>) => void;
	deleteDriver: (id: string) => void;
	clearCurrentDriver: () => void;
}

type DriversStore = DriversState & DriversActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useDriversStore = create<DriversStore>((set, get) => ({
	// Global
	drivers: [],
	loading: true,
	error: null,
	initialized: false,

	// Current driver
	currentDriver: null,
	loadingDriver: false,
	driverError: null,

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

	fetchDriverById: async (id: string) => {
		set({ loadingDriver: true, driverError: null, currentDriver: null });
		try {
			// Add 1.5 second delay to see skeleton
			await delay(1500);

			// First search in local store
			let driver = get().drivers.find((d) => d.id === id);

			// If not found, search in service
			if (!driver) {
				const fetchedDriver = await driversService.getDriverById(id);
				if (fetchedDriver) {
					driver = fetchedDriver;
				}
			}

			if (!driver) {
				throw new Error("Conductor no encontrado");
			}

			set({ currentDriver: driver, loadingDriver: false });
		} catch (error) {
			console.error("Error fetching driver:", error);
			set({
				driverError:
					error instanceof Error ? error.message : "Error desconocido",
				loadingDriver: false,
			});
		}
	},

	clearCurrentDriver: () => {
		set({ currentDriver: null, loadingDriver: false, driverError: null });
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
			currentDriver:
				state.currentDriver?.id === id
					? { ...state.currentDriver, ...updates }
					: state.currentDriver,
		}));
	},

	deleteDriver: (id) => {
		set((state) => ({
			drivers: state.drivers.filter((driver) => driver.id !== id),
		}));
	},
}));
