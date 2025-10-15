import type { Report } from "@/models/report";
import { reports as reportsService } from "@/services/data";
import { create } from "zustand";

interface ReportsState {
	reports: Report[];
	loading: boolean;
	error: string | null;
	initialized: boolean;
}

interface ReportsActions {
	fetchReports: () => Promise<void>;
	addReport: (report: Report) => void;
	updateReport: (id: string, updates: Partial<Report>) => void;
	deleteReport: (id: string) => void;
	markAsRead: (id: string) => void;
	markAsUnread: (id: string) => void;
	getReportById: (id: string) => Report | undefined;
}

type ReportsStore = ReportsState & ReportsActions;

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useReportsStore = create<ReportsStore>((set, get) => ({
	reports: [],
	loading: true,
	error: null,
	initialized: false,

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

	getReportById: (id) => {
		return get().reports.find((report) => report.id === id);
	},
}));
