import { lightTheme, darkTheme } from "@/constants/theme";
import { TimeRange, TimeRegistration } from "@/models/timeRegistration";

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

/**
 * Calculate total hours from time ranges
 * FIXED: Properly handle Date objects and strings, exclude ranges without endTime
 */
export function calculateTotalHours(ranges: TimeRange[]): number {
	return ranges.reduce((total, range) => {
		// Only count completed ranges (with endTime)
		if (range.endTime) {
			const startTime =
				range.startTime instanceof Date
					? range.startTime
					: new Date(range.startTime);
			const endTime =
				range.endTime instanceof Date
					? range.endTime
					: new Date(range.endTime);

			const diffMs = endTime.getTime() - startTime.getTime();
			const hours = diffMs / (1000 * 60 * 60);
			return total + hours;
		}
		return total;
	}, 0);
}

/**
 * Format hours to HH:MM format or Xh Ym format
 */
export function formatHours(
	hours: number,
	shortFormat: boolean = false
): string {
	const h = Math.floor(hours);
	const m = Math.round((hours - h) * 60);

	if (shortFormat) {
		return `${h}h ${m}m`;
	}

	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Check if a time registration has an active range
 * FIXED: Only check for ranges without endTime (removed isPaused check)
 */
export function hasActiveRange(registration: TimeRegistration): boolean {
	return registration.timeRanges.some((range) => !range.endTime);
}

/**
 * Calculate current working minutes including active range
 * This is for real-time display during active work
 */
export function calculateCurrentMinutes(
	ranges: TimeRange[],
	currentTime: Date
): number {
	let totalMinutes = 0;

	ranges.forEach((range) => {
		const start =
			range.startTime instanceof Date
				? range.startTime
				: new Date(range.startTime);

		// For completed ranges, use endTime
		// For active ranges (no endTime), use current time
		const end = range.endTime
			? range.endTime instanceof Date
				? range.endTime
				: new Date(range.endTime)
			: currentTime;

		const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
		totalMinutes += diffMinutes;
	});

	return Math.floor(totalMinutes);
}

/**
 * Calculate time diff to show right color indicator
 * - Green (success): within ±15 minutes of expected (465-495 minutes)
 * - Orange (warning): within ±59 minutes of expected (421-464 or 496-539 minutes)
 * - Red (error): more than 60 minutes difference (<421 or >539 minutes)
 * @param totalMinutes - Total minutes worked
 * @param theme - Theme object (lightTheme or darkTheme) to use for colors
 */
export function getTotalDayTimeColor(
	totalMinutes: number,
	theme: typeof lightTheme | typeof darkTheme = lightTheme
) {
	const expectedMinutes = 480; // 8 hours
	const diff = Math.abs(totalMinutes - expectedMinutes);

	// Perfect range: ±15 minutes (green)
	if (diff <= 15) {
		return {
			container: theme.colors.success,
			text: theme.colors.onSuccess,
		};
	}

	// Acceptable range: ±59 minutes (orange/warning)
	if (diff <= 59) {
		return {
			container: theme.colors.warning,
			text: theme.colors.onWarning,
		};
	}

	// Outside acceptable range: ±60+ minutes (red/error)
	return {
		container: theme.colors.error,
		text: theme.colors.onError,
	};
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
	const today = getToday();
	const checkDate = new Date(date);
	checkDate.setHours(0, 0, 0, 0);
	return today.getTime() === checkDate.getTime();
}

/**
 * Get end of day for a given date (23:59:59.999)
 */
export function getEndOfDay(date: Date): Date {
	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);
	return endOfDay;
}

/**
 * Auto-close active ranges that belong to past days
 * Returns updated registration with closed ranges
 */
export function autoCloseOldActiveRanges(
	registration: TimeRegistration
): TimeRegistration {
	const registrationDate = new Date(registration.date);
	registrationDate.setHours(0, 0, 0, 0);

	// Only process if registration is not from today
	if (isToday(registrationDate)) {
		return registration;
	}

	let hasChanges = false;
	const updatedRanges = registration.timeRanges.map((range) => {
		// If range has no endTime (active) and registration is from a past day
		if (!range.endTime) {
			hasChanges = true;
			// Close it at end of that day (23:59:59)
			return {
				...range,
				endTime: getEndOfDay(registrationDate),
				isPaused: false,
				pausedAt: null,
			};
		}
		return range;
	});

	if (!hasChanges) {
		return registration;
	}

	return {
		...registration,
		timeRanges: updatedRanges,
		totalHours: calculateTotalHours(updatedRanges),
		isActive: false, // No longer active since all ranges are closed
	};
}
