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
}

interface ReportsActions {
	fetchReports: () => Promise<void>;
	fetchReportById: (id: string) => Promise<void>;
	addReport: (report: Report) => void;
	updateReport: (id: string, updates: Partial<Report>) => void;
	deleteReport: (id: string) => void;
	markAsRead: (id: string) => void;
	markAsUnread: (id: string) => void;
	clearCurrentReport: () => void;
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

	fetchReports: async () => {
		set({ loading: true, error: null });
		try {
			// Add 2 second delay to see skeleton
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
			// Add 1.5 second delay to see skeleton
			await delay(1500);

			// First search in local store
			let report = get().reports.find((r) => r.id === id);

			// If not found, search in service
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
		}));
	},

	deleteReport: (id) => {
		set((state) => ({
			reports: state.reports.filter((report) => report.id !== id),
		}));
	},

	markAsRead: (id) => {
		get().updateReport(id, { read: true });
	},

	markAsUnread: (id) => {
		get().updateReport(id, { read: false });
	},
}));
