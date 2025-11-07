import type {
	Note,
	TimeRange,
	TimeRegistration,
} from "@/models/timeRegistration";
import { timeRegistrations as timeRegistrationsService } from "@/services/data";
import { calculateTotalHours, hasActiveRange } from "@/utils/dateUtils";
import * as Crypto from "expo-crypto";
import { create } from "zustand";

interface TimeRegistrationsState {
	// Global
	registrations: TimeRegistration[];
	loading: boolean;
	error: string | null;
	initialized: boolean;

	// Current registration (for selected date)
	currentRegistration: TimeRegistration | null;
	loadingRegistration: boolean;
	registrationError: string | null;

	// Active tracking
	activeDriverId: string | null;
	activeDate: Date;
}

interface TimeRegistrationsActions {
	// Data fetching
	fetchRegistrationsByDriver: (driverId: string) => Promise<void>;
	fetchRegistrationByDriverAndDate: (
		driverId: string,
		date: Date
	) => Promise<void>;
	clearCurrentRegistration: () => void;

	// Time tracking operations
	startWork: (driverId: string, date: Date) => Promise<void>;
	pauseWork: (driverId: string, date: Date) => Promise<void>;
	resumeWork: (driverId: string, date: Date) => Promise<void>;
	endWork: (driverId: string, date: Date) => Promise<void>;

	// CRUD operations for time ranges
	addTimeRange: (
		driverId: string,
		date: Date,
		range: Omit<TimeRange, "id">
	) => void;
	updateTimeRange: (
		registrationId: string,
		rangeId: string,
		updates: Partial<TimeRange>
	) => void;
	deleteTimeRange: (registrationId: string, rangeId: string) => void;

	// CRUD operations for notes
	addNote: (registrationId: string, text: string) => void;
	updateNote: (registrationId: string, noteId: string, text: string) => void;
	deleteNote: (registrationId: string, noteId: string) => void;

	// Active date management
	setActiveDate: (date: Date) => void;
}

type TimeRegistrationsStore = TimeRegistrationsState & TimeRegistrationsActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTimeRegistrationsStore = create<TimeRegistrationsStore>(
	(set, get) => ({
		// Initial state
		registrations: [],
		loading: false,
		error: null,
		initialized: false,

		currentRegistration: null,
		loadingRegistration: false,
		registrationError: null,

		activeDriverId: null,
		activeDate: new Date(),

		fetchRegistrationsByDriver: async (driverId: string) => {
			set({ loading: true, error: null });
			try {
				await delay(1500);

				const data =
					await timeRegistrationsService.getTimeRegistrationsByDriverId(
						driverId
					);
				set({ registrations: data, loading: false, initialized: true });
			} catch (error) {
				console.error("Error fetching registrations:", error);
				set({
					error:
						error instanceof Error ? error.message : "Error desconocido",
					loading: false,
					initialized: true,
				});
			}
		},

		fetchRegistrationByDriverAndDate: async (
			driverId: string,
			date: Date
		) => {
			set({
				loadingRegistration: true,
				registrationError: null,
				currentRegistration: null,
			});
			try {
				// First check local store
				const localReg = get().registrations.find((reg) => {
					const regDate = new Date(reg.date);
					regDate.setHours(0, 0, 0, 0);
					const targetDate = new Date(date);
					targetDate.setHours(0, 0, 0, 0);
					return (
						reg.driverId === driverId &&
						regDate.getTime() === targetDate.getTime()
					);
				});

				if (localReg) {
					set({
						currentRegistration: localReg,
						loadingRegistration: false,
					});
					return;
				}

				// If not found locally, fetch from service
				const fetchedReg =
					await timeRegistrationsService.getTimeRegistrationByDriverAndDate(
						driverId,
						date
					);

				set({
					currentRegistration: fetchedReg,
					loadingRegistration: false,
				});
			} catch (error) {
				console.error("Error fetching registration:", error);
				set({
					registrationError:
						error instanceof Error ? error.message : "Error desconocido",
					loadingRegistration: false,
				});
			}
		},

		clearCurrentRegistration: () => {
			set({
				currentRegistration: null,
				loadingRegistration: false,
				registrationError: null,
			});
		},

		startWork: async (driverId: string, date: Date) => {
			const { currentRegistration } = get();

			// Check if there's already an active range
			if (currentRegistration && hasActiveRange(currentRegistration)) {
				throw new Error("Ya hay un registro de tiempo activo");
			}

			const newRange: TimeRange = {
				id: Crypto.randomUUID(),
				startTime: new Date(),
				endTime: null,
				isPaused: false,
				pausedAt: null,
			};

			if (!currentRegistration) {
				// Create new registration
				const newRegistration: TimeRegistration = {
					id: Crypto.randomUUID(),
					driverId,
					date: new Date(date),
					timeRanges: [newRange],
					totalHours: 0,
					isActive: true,
					notes: [],
				};

				set((state) => ({
					registrations: [...state.registrations, newRegistration],
					currentRegistration: newRegistration,
					activeDriverId: driverId,
				}));
			} else {
				// Add range to existing registration
				const updatedRegistration = {
					...currentRegistration,
					timeRanges: [...currentRegistration.timeRanges, newRange],
					isActive: true,
				};

				set((state) => ({
					registrations: state.registrations.map((reg) =>
						reg.id === currentRegistration.id ? updatedRegistration : reg
					),
					currentRegistration: updatedRegistration,
					activeDriverId: driverId,
				}));
			}
		},

		pauseWork: async (driverId: string, date: Date) => {
			const { currentRegistration } = get();

			if (!currentRegistration || !hasActiveRange(currentRegistration)) {
				throw new Error("No hay un registro de tiempo activo para pausar");
			}

			const activeRange = currentRegistration.timeRanges.find(
				(range) => !range.endTime
			);

			if (!activeRange) {
				throw new Error("No se encontró un rango activo");
			}

			const updatedRange = {
				...activeRange,
				endTime: new Date(),
				isPaused: false,
				pausedAt: null,
			};

			const updatedRanges = currentRegistration.timeRanges.map((range) =>
				range.id === activeRange.id ? updatedRange : range
			);

			const updatedRegistration = {
				...currentRegistration,
				timeRanges: updatedRanges,
				totalHours: calculateTotalHours(updatedRanges),
				isActive: false, // No active range now
			};

			set((state) => ({
				registrations: state.registrations.map((reg) =>
					reg.id === currentRegistration.id ? updatedRegistration : reg
				),
				currentRegistration: updatedRegistration,
			}));
		},

		resumeWork: async (driverId: string, date: Date) => {
			const { currentRegistration } = get();

			if (!currentRegistration) {
				throw new Error("No hay un registro de tiempo para reanudar");
			}

			const newRange: TimeRange = {
				id: Crypto.randomUUID(),
				startTime: new Date(),
				endTime: null,
				isPaused: false,
				pausedAt: null,
			};

			const updatedRegistration = {
				...currentRegistration,
				timeRanges: [...currentRegistration.timeRanges, newRange],
				isActive: true,
			};

			set((state) => ({
				registrations: state.registrations.map((reg) =>
					reg.id === currentRegistration.id ? updatedRegistration : reg
				),
				currentRegistration: updatedRegistration,
				activeDriverId: driverId,
			}));
		},

		endWork: async (driverId: string, date: Date) => {
			const { currentRegistration } = get();

			if (!currentRegistration || !hasActiveRange(currentRegistration)) {
				throw new Error(
					"No hay un registro de tiempo activo para finalizar"
				);
			}

			const activeRange = currentRegistration.timeRanges.find(
				(range) => !range.endTime
			);

			if (!activeRange) {
				throw new Error("No se encontró un rango activo");
			}

			const updatedRange = {
				...activeRange,
				endTime: new Date(),
				isPaused: false,
				pausedAt: null,
			};

			const updatedRanges = currentRegistration.timeRanges.map((range) =>
				range.id === activeRange.id ? updatedRange : range
			);

			const updatedRegistration = {
				...currentRegistration,
				timeRanges: updatedRanges,
				totalHours: calculateTotalHours(updatedRanges),
				isActive: false,
			};

			set((state) => ({
				registrations: state.registrations.map((reg) =>
					reg.id === currentRegistration.id ? updatedRegistration : reg
				),
				currentRegistration: updatedRegistration,
				activeDriverId: null,
			}));
		},

		addTimeRange: (driverId, date, range) => {
			const { currentRegistration } = get();
			const newRange: TimeRange = {
				...range,
				id: Crypto.randomUUID(),
			};

			if (!currentRegistration) {
				const newRegistration: TimeRegistration = {
					id: Crypto.randomUUID(),
					driverId,
					date: new Date(date),
					timeRanges: [newRange],
					totalHours: calculateTotalHours([newRange]),
					isActive: !newRange.endTime,
					notes: [],
				};

				set((state) => ({
					registrations: [...state.registrations, newRegistration],
					currentRegistration: newRegistration,
				}));
			} else {
				const updatedRanges = [...currentRegistration.timeRanges, newRange];
				const updatedRegistration = {
					...currentRegistration,
					timeRanges: updatedRanges,
					totalHours: calculateTotalHours(updatedRanges),
					isActive: updatedRanges.some((r) => !r.endTime),
				};

				set((state) => ({
					registrations: state.registrations.map((reg) =>
						reg.id === currentRegistration.id ? updatedRegistration : reg
					),
					currentRegistration: updatedRegistration,
				}));
			}
		},

		updateTimeRange: (registrationId, rangeId, updates) => {
			set((state) => {
				const registration = state.registrations.find(
					(reg) => reg.id === registrationId
				);
				if (!registration) return state;

				const updatedRanges = registration.timeRanges.map((range) =>
					range.id === rangeId ? { ...range, ...updates } : range
				);

				const updatedRegistration = {
					...registration,
					timeRanges: updatedRanges,
					totalHours: calculateTotalHours(updatedRanges),
					isActive: updatedRanges.some((r) => !r.endTime),
				};

				return {
					registrations: state.registrations.map((reg) =>
						reg.id === registrationId ? updatedRegistration : reg
					),
					currentRegistration:
						state.currentRegistration?.id === registrationId
							? updatedRegistration
							: state.currentRegistration,
				};
			});
		},

		deleteTimeRange: (registrationId, rangeId) => {
			set((state) => {
				const registration = state.registrations.find(
					(reg) => reg.id === registrationId
				);
				if (!registration) return state;

				const updatedRanges = registration.timeRanges.filter(
					(range) => range.id !== rangeId
				);

				const updatedRegistration = {
					...registration,
					timeRanges: updatedRanges,
					totalHours: calculateTotalHours(updatedRanges),
					isActive: updatedRanges.some((r) => !r.endTime),
				};

				return {
					registrations: state.registrations.map((reg) =>
						reg.id === registrationId ? updatedRegistration : reg
					),
					currentRegistration:
						state.currentRegistration?.id === registrationId
							? updatedRegistration
							: state.currentRegistration,
				};
			});
		},

		// Note management actions
		addNote: (registrationId: string, text: string) => {
			set((state) => {
				const registration = state.registrations.find(
					(reg) => reg.id === registrationId
				);
				if (!registration) return state;

				const newNote: Note = {
					id: Crypto.randomUUID(),
					text,
					createdAt: new Date(),
				};

				const updatedNotes = [...registration.notes, newNote];
				const updatedRegistration = {
					...registration,
					notes: updatedNotes,
				};

				return {
					registrations: state.registrations.map((reg) =>
						reg.id === registrationId ? updatedRegistration : reg
					),
					currentRegistration:
						state.currentRegistration?.id === registrationId
							? updatedRegistration
							: state.currentRegistration,
				};
			});
		},

		updateNote: (registrationId: string, noteId: string, text: string) => {
			set((state) => {
				const registration = state.registrations.find(
					(reg) => reg.id === registrationId
				);
				if (!registration) return state;

				const updatedNotes = registration.notes.map((note) =>
					note.id === noteId
						? { ...note, text, updatedAt: new Date() }
						: note
				);

				const updatedRegistration = {
					...registration,
					notes: updatedNotes,
				};

				return {
					registrations: state.registrations.map((reg) =>
						reg.id === registrationId ? updatedRegistration : reg
					),
					currentRegistration:
						state.currentRegistration?.id === registrationId
							? updatedRegistration
							: state.currentRegistration,
				};
			});
		},

		deleteNote: (registrationId: string, noteId: string) => {
			set((state) => {
				const registration = state.registrations.find(
					(reg) => reg.id === registrationId
				);
				if (!registration) return state;

				const updatedNotes = registration.notes.filter(
					(note) => note.id !== noteId
				);

				const updatedRegistration = {
					...registration,
					notes: updatedNotes,
				};

				return {
					registrations: state.registrations.map((reg) =>
						reg.id === registrationId ? updatedRegistration : reg
					),
					currentRegistration:
						state.currentRegistration?.id === registrationId
							? updatedRegistration
							: state.currentRegistration,
				};
			});
		},

		setActiveDate: (date: Date) => {
			set({ activeDate: date });
		},
	})
);
