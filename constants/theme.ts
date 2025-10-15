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

		error: "#ba1a1a",
		onError: "#ffffff",
		errorContainer: "#ffdad6",
		onErrorContainer: "#93000a",

		warning: "#ffb74d",
		onWarning: "#4d2c00",
		warningContainer: "#ffe0b2",
		onWarningContainer: "#663c00",

		// For status badge
		statusActive: "#2E7D32",
		statusActiveContainer: "#DDEEE2",

		statusInactive: "#49454F",
		statusInactiveContainer: "#C0C0C0",

		statusMaintenance: "#E65100",
		statusMaintenanceContainer: "#FFF3E0",
		statusHolidays: "#E65100",
		statusHolidaysContainer: "#FFF3E0",

		statusBrokenDown: "#C62828",
		statusBrokenDownContainer: "#FFEBEE",
		statusSickLeave: "#C62828",
		statusSickLeaveContainer: "#FFEBEE",

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

		primary: "#96d5a7",
		onPrimary: "#00391c",
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

		error: "#ba1a1a",
		onError: "#ffffff",
		errorContainer: "#ffdad6",
		onErrorContainer: "#93000a",

		warning: "#ffb74d",
		onWarning: "#4d2c00",
		warningContainer: "#ffe0b2",
		onWarningContainer: "#663c00",

		// For status badge
		statusActive: "#2E7D32",
		statusActiveContainer: "#DDEEE2",

		statusInactive: "#49454F",
		statusInactiveContainer: "#C0C0C0",

		statusMaintenance: "#E65100",
		statusMaintenanceContainer: "#FFF3E0",
		statusHolidays: "#E65100",
		statusHolidaysContainer: "#FFF3E0",

		statusBrokenDown: "#C62828",
		statusBrokenDownContainer: "#FFEBEE",
		statusSickLeave: "#C62828",
		statusSickLeaveContainer: "#FFEBEE",

		background: "#e0e0e0",
		onBackground: "#181d18",

		surface: "#f0f0f0",
		onSurface: "#181d18",

		surfaceVariant: "#101510",
		onSurfaceVariant: "#c0c9bf",

		outline: "#8b938a",

		surfaceDisabled: "rgba(225,225,225,0.12)",
		onSurfaceDisabled: "rgba(225,225,225,0.38)",

		inverseSurface: "#dfe4dd",
		inverseOnSurface: "#2c322d",
		inversePrimary: "#2d6a44",

		shadow: "#000000",
		backdrop: "rgba(0,0,0,0.5)",

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

// Elevaciones (sombras)
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
