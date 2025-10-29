/**
 * From ISO string (ej: 2025-10-09T12:30:00Z) to dd/MM/yyyy HH:mm format
 */
export function formatISODate(isoString: string): string {
	if (!isoString) return "";
	const date = new Date(isoString);
	if (isNaN(date.getTime())) return "";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

/**
 * From local date to ISO format (ej: "2025-10-09T10:30:00.000Z")
 */
export function toISOStringFromLocal(date: Date): string {
	return date.toISOString();
}

/**
 * Formats a date string to Spanish locale format (DD/MM/YYYY)
 * Handles YYYY-MM-DD format without timezone issues
 */
export function formatDateToDisplay(
	date: string | Date | undefined | null
): string {
	if (!date) return "";

	let dateObj: Date;

	if (typeof date === "string") {
		// If it's a YYYY-MM-DD format, parse as local date
		const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
		if (isoDatePattern.test(date)) {
			const [year, month, day] = date.split("-").map(Number);
			dateObj = new Date(year, month - 1, day);
		} else {
			dateObj = new Date(date);
		}
	} else {
		dateObj = date;
	}

	if (isNaN(dateObj.getTime())) return "";

	const day = String(dateObj.getDate()).padStart(2, "0");
	const month = String(dateObj.getMonth() + 1).padStart(2, "0");
	const year = dateObj.getFullYear();

	return `${day}/${month}/${year}`;
}

/**
 * Formats a date to ISO string format (YYYY-MM-DD)
 * Uses local date components to avoid timezone issues
 */
export function formatDateToISO(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Parses a date string or returns a default date
 * For YYYY-MM-DD format, creates date using local timezone to avoid timezone issues
 */
export function parseDate(
	dateString: string | undefined | null,
	defaultDate?: Date
): Date {
	if (!dateString) return defaultDate || new Date(2000, 0, 1);

	// If it's a YYYY-MM-DD format (ISO date without time), parse it as local date
	const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
	if (isoDatePattern.test(dateString)) {
		const [year, month, day] = dateString.split("-").map(Number);
		return new Date(year, month - 1, day);
	}

	// For other formats, use standard Date parsing
	const parsed = new Date(dateString);
	return isNaN(parsed.getTime())
		? defaultDate || new Date(2000, 0, 1)
		: parsed;
}

/**
 * Gets the current date at midnight
 */
export function getToday(): Date {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

/**
 * Checks if a date is valid
 */
export function isValidDate(date: any): boolean {
	if (!date) return false;
	const dateObj = date instanceof Date ? date : new Date(date);
	return !isNaN(dateObj.getTime());
}
