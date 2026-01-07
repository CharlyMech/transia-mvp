import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: "#57a773",
		onPrimary: "#ffffff",
		primaryContainer: "#8FC49A",
		onPrimaryContainer: "#11512e",

		secondary: "#4f6353",
		onSecondary: "#ffffff",
		secondaryContainer: "#d2e8d4",
		onSecondaryContainer: "#384b3c",

		tertiary: "#3a646f",
		onTertiary: "#ffffff",
		tertiaryContainer: "#beeaf6",
		onTertiaryContainer: "#214c57",

		// Semantic states
		success: "#2E7D32",
		onSuccess: "#FFFFFF",
		successContainer: "#C8E6C9",
		onSuccessContainer: "#1B5E20",

		warning: "#F57C00",
		onWarning: "#FFFFFF",
		warningContainer: "#FFE0B2",
		onWarningContainer: "#E65100",

		error: "#D32F2F",
		onError: "#FFFFFF",
		errorContainer: "#FFCDD2",
		onErrorContainer: "#B71C1C",


		// Status
		statusActive: "#2E7D32",
		onStatusActive: "#FFFFFF",
		statusActiveContainer: "#E6F4EA",
		onStatusActiveContainer: "#1B5E20",

		statusInactive: "#9E9E9E",
		onStatusInactive: "#FFFFFF",
		statusInactiveContainer: "#ECEFF1",
		onStatusInactiveContainer: "#37474F",

		statusOnService: "#1E6BB8",
		onStatusOnService: "#FFFFFF",
		statusOnServiceContainer: "#E3F2FD",
		onStatusOnServiceContainer: "#0D47A1",

		statusMaintenance: "#8E24AA",
		onStatusMaintenance: "#FFFFFF",
		statusMaintenanceContainer: "#F3E5F5",
		onStatusMaintenanceContainer: "#4A148C",

		statusHolidays: "#1E6BB8",
		onStatusHolidays: "#FFFFFF",
		statusHolidaysContainer: "#E3F2FD",
		onStatusHolidaysContainer: "#0D47A1",

		statusBrokenDown: "#B3261E",
		onStatusBrokenDown: "#FFFFFF",
		statusBrokenDownContainer: "#FFE3E3",
		onStatusBrokenDownContainer: "#7F1D1D",

		statusSickLeave: "#B3261E",
		onStatusSickLeave: "#FFFFFF",
		statusSickLeaveContainer: "#FFE3E3",
		onStatusSickLeaveContainer: "#7F1D1D",

		background: "#e0e0e0",
		onBackground: "#181d18",

		surface: "#f0f0f0",
		onSurface: "#181d18",

		surfaceVariant: "#f6fbf3",
		onSurfaceVariant: "#49454F",

		outline: "#c1c1c1",

		surfaceDisabled: "rgba(28,27,31,0.12)",
		onSurfaceDisabled: "rgba(28,27,31,0.38)",

		inverseSurface: "#2c322d",
		inverseOnSurface: "#edf2eb",
		inversePrimary: "#96d5a7",

		shadow: "#000000",
		backdrop: "rgba(0,0,0,0.4)",

		elevation: {
			level0: "transparent",
			level1: "#F5F5F5",
			level2: "#F0F0F0",
			level3: "#EBEBEB",
			level4: "#E8E8E8",
			level5: "#E0E0E0",
		},
	},
};

export const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,

		primary: "#57a773",
		onPrimary: "#ffffff",
		primaryContainer: "#11512e",
		onPrimaryContainer: "#b1f1c1",

		secondary: "#b6ccb9",
		onSecondary: "#223527",
		secondaryContainer: "#384b3c",
		onSecondaryContainer: "#d2e8d4",

		tertiary: "#a2cdda",
		onTertiary: "#023640",
		tertiaryContainer: "#214c57",
		onTertiaryContainer: "#beeaf6",

		// Semantic states
		success: "#66BB6A",
		onSuccess: "#FFFFFF",
		successContainer: "#1B5E20",
		onSuccessContainer: "#A5D6A7",

		warning: "#FFA726",
		onWarning: "#FFFFFF",
		warningContainer: "#E65100",
		onWarningContainer: "#FFCC80",

		error: "#EF5350",
		onError: "#FFFFFF",
		errorContainer: "#B71C1C",
		onErrorContainer: "#EF9A9A",


		// Status
		statusActive: "#6FCF97",
		onStatusActive: "#0B3D24",
		statusActiveContainer: "#1E4F34",
		onStatusActiveContainer: "#B7EFC5",

		statusInactive: "#BDBDBD",
		onStatusInactive: "#1A1A1A",
		statusInactiveContainer: "#2A2A2A",
		onStatusInactiveContainer: "#E0E0E0",

		statusOnService: "#8AB4F8",
		onStatusOnService: "#002F6C",
		statusOnServiceContainer: "#1A3B5D",
		onStatusOnServiceContainer: "#C3DAFF",

		statusMaintenance: "#D7A6E8",
		onStatusMaintenance: "#3A1244",
		statusMaintenanceContainer: "#4A235A",
		onStatusMaintenanceContainer: "#F1D9FA",

		statusHolidays: "#8AB4F8",
		onStatusHolidays: "#002F6C",
		statusHolidaysContainer: "#1A3B5D",
		onStatusHolidaysContainer: "#C3DAFF",

		statusBrokenDown: "#F28B82",
		onStatusBrokenDown: "#5F1410",
		statusBrokenDownContainer: "#7A1A1A",
		onStatusBrokenDownContainer: "#FFB4AB",

		statusSickLeave: "#F28B82",
		onStatusSickLeave: "#5F1410",
		statusSickLeaveContainer: "#7A1A1A",
		onStatusSickLeaveContainer: "#FFB4AB",


		background: "#1e1e1e",
		onBackground: "#E4EAE5",

		surface: "#373737",
		onSurface: "#E4EAE5",

		surfaceVariant: "#232B25",
		onSurfaceVariant: "#B9C4BC",

		outline: "#505050",

		surfaceDisabled: "rgba(228,234,229,0.12)",
		onSurfaceDisabled: "rgba(228,234,229,0.38)",

		inverseSurface: "#E4EAE5",
		inverseOnSurface: "#1A211C",
		inversePrimary: "#2D6A44",

		shadow: "#545454",
		backdrop: "rgba(0,0,0,0.55)",

		elevation: {
			level0: "transparent",
			level1: "rgba(77,182,172,0.05)",
			level2: "rgba(77,182,172,0.08)",
			level3: "rgba(77,182,172,0.11)",
			level4: "rgba(77,182,172,0.12)",
			level5: "rgba(77,182,172,0.14)",
		},
	},
};

// Roundness
export const roundness = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
	full: 10000,
};

// Spacing
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
	xxxl: 56,
};

// Font sizes
export const typography = {
	displayLarge: 57,
	displayMedium: 45,
	displaySmall: 36,
	headlineLarge: 32,
	headlineMedium: 28,
	headlineSmall: 24,
	titleLarge: 22,
	titleMedium: 18,
	titleSmall: 14,
	bodyLarge: 16,
	bodyMedium: 14,
	bodySmall: 12,
	labelLarge: 14,
	labelMedium: 12,
	labelSmall: 11,
};

// Shadow elevations
export const elevation = (theme: typeof lightTheme | typeof darkTheme) => ({
	small: {
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	medium: {
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 4,
	},
	large: {
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 8,
	},
});
