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
 */
export function formatDateToDisplay(
	date: string | Date | undefined | null
): string {
	if (!date) return "";

	const dateObj = typeof date === "string" ? new Date(date) : date;

	if (isNaN(dateObj.getTime())) return "";

	return dateObj.toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

/**
 * Formats a date to ISO string format (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
	return date.toISOString().split("T")[0];
}

/**
 * Parses a date string or returns a default date
 */
export function parseDate(
	dateString: string | undefined | null,
	defaultDate?: Date
): Date {
	if (!dateString) return defaultDate || new Date(2000, 0, 1);

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
