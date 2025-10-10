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
