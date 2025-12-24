import type { Report } from "@/models";

/**
 * Report service interface
 * All report data providers must implement this interface
 */
export interface IReportService {
	/**
	 * Get all reports
	 * @returns List of all reports
	 */
	listReports(): Promise<Report[]>;

	/**
	 * Get a report by ID
	 * @param id - Report ID
	 * @returns Report object or null if not found
	 */
	getReportById(id: string): Promise<Report | null>;
}
