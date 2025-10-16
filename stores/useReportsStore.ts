import type { Report } from "@/models/report";
import { reports as reportsService } from "@/services/data";
import { create } from "zustand";

interface ReportsState {
	// Global
	reports: Report[];
	loading: boolean;
	error: string | null;
	initialized: boolean;

	// Current report
	currentReport: Report | null;
	loadingReport: boolean;
	reportError: string | null;

	// Selected report (for actions modal)
	selectedReport: Report | null;
}

interface ReportsActions {
	// Data fetching
	fetchReports: () => Promise<void>;
	fetchReportById: (id: string) => Promise<void>;
	clearCurrentReport: () => void;

	// CRUD operations
	addReport: (report: Report) => void;
	updateReport: (id: string, updates: Partial<Report>) => void;
	deleteReport: (id: string) => Promise<void>;

	// Selected report actions
	setSelectedReport: (report: Report | null) => void;
	clearSelectedReport: () => void;
}

type ReportsStore = ReportsState & ReportsActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useReportsStore = create<ReportsStore>((set, get) => ({
	// Global
	reports: [],
	loading: true,
	error: null,
	initialized: false,

	// Current report
	currentReport: null,
	loadingReport: false,
	reportError: null,

	// Selected report
	selectedReport: null,

	fetchReports: async () => {
		set({ loading: true, error: null });
		try {
			await delay(2000);
			const data = await reportsService.listReports();
			set({ reports: data, loading: false, initialized: true });
		} catch (error) {
			console.error("Error fetching reports:", error);
			set({
				error: error instanceof Error ? error.message : "Error desconocido",
				loading: false,
				initialized: true,
			});
		}
	},

	fetchReportById: async (id: string) => {
		set({ loadingReport: true, reportError: null, currentReport: null });
		try {
			await delay(1500);
			let report = get().reports.find((r) => r.id === id);

			if (!report) {
				const fetchedReport = await reportsService.getReportById(id);
				if (fetchedReport) {
					report = fetchedReport;
				}
			}

			if (!report) {
				throw new Error("Reporte no encontrado");
			}

			set({ currentReport: report, loadingReport: false });
		} catch (error) {
			console.error("Error fetching report:", error);
			set({
				reportError:
					error instanceof Error ? error.message : "Error desconocido",
				loadingReport: false,
			});
		}
	},

	clearCurrentReport: () => {
		set({ currentReport: null, loadingReport: false, reportError: null });
	},

	addReport: (report) => {
		set((state) => ({
			reports: [...state.reports, report],
		}));
	},

	updateReport: (id, updates) => {
		set((state) => ({
			reports: state.reports.map((report) =>
				report.id === id ? { ...report, ...updates } : report
			),
			currentReport:
				state.currentReport?.id === id
					? { ...state.currentReport, ...updates }
					: state.currentReport,
			selectedReport:
				state.selectedReport?.id === id
					? { ...state.selectedReport, ...updates }
					: state.selectedReport,
		}));
	},

	deleteReport: async (id: string) => {
		try {
			// TODO: Call service when available
			// await reportsService.deleteReport(id);

			set((state) => ({
				reports: state.reports.filter((report) => report.id !== id),
			}));

			console.log("Reporte eliminado:", id);
		} catch (error) {
			console.error("Error al eliminar reporte:", error);
			throw error;
		}
	},

	setSelectedReport: (report) => {
		set({ selectedReport: report });
	},

	clearSelectedReport: () => {
		set({ selectedReport: null });
	},
}));
