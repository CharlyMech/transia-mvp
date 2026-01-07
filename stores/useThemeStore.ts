import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName, LayoutAnimation, Platform, UIManager } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Enable LayoutAnimation on Android
if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
	// Theme settings
	mode: ThemeMode;

	// Computed theme based on mode and system preferences
	activeTheme: "light" | "dark";

	// UI State
	isInitialized: boolean;
}

interface ThemeActions {
	// Theme operations
	setTheme: (mode: ThemeMode) => void;
	toggleTheme: () => void;

	// Internal helpers
	updateActiveTheme: (systemColorScheme: ColorSchemeName) => void;

	// Initialization
	initialize: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

/**
 * Get the active theme based on mode and system preference
 */
const getActiveTheme = (
	mode: ThemeMode,
	systemColorScheme: ColorSchemeName
): "light" | "dark" => {
	if (mode === "system") {
		return systemColorScheme === "dark" ? "dark" : "light";
	}
	return mode;
};

/**
 * Zustand store for theme management with persistence
 * Supports light, dark, and system themes
 */
export const useThemeStore = create<ThemeStore>()(
	persist(
		(set, get) => {
			// Get initial system color scheme
			const systemColorScheme = Appearance.getColorScheme();

			return {
				// Initial state
				mode: "system",
				activeTheme: systemColorScheme === "dark" ? "dark" : "light",
				isInitialized: false,

				setTheme: (mode: ThemeMode) => {
					// Animate the change
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

					const systemColorScheme = Appearance.getColorScheme();
					const activeTheme = getActiveTheme(mode, systemColorScheme);

					set({
						mode,
						activeTheme,
					});
				},

				toggleTheme: () => {
					// Animate the change
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

					const { mode } = get();

					// If in system mode, switch to the opposite of current active active
					// If in light/dark mode, just toggle
					const currentActiveTheme = get().activeTheme;
					const newMode: ThemeMode = currentActiveTheme === "light" ? "dark" : "light";

					const systemColorScheme = Appearance.getColorScheme();
					const activeTheme = getActiveTheme(newMode, systemColorScheme);

					set({
						mode: newMode,
						activeTheme,
					});
				},

				updateActiveTheme: (systemColorScheme: ColorSchemeName) => {
					const { mode } = get();
					const activeTheme = getActiveTheme(mode, systemColorScheme);

					// Only update if mode is "system" or if activeTheme changed
					if (mode === "system" || get().activeTheme !== activeTheme) {
						// Only animate if there's an actual change
						if (get().activeTheme !== activeTheme) {
							LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
						}
						set({ activeTheme });
					}
				},

				initialize: () => {
					const systemColorScheme = Appearance.getColorScheme();
					const { mode } = get();
					const activeTheme = getActiveTheme(mode, systemColorScheme);

					set({
						activeTheme,
						isInitialized: true,
					});
				},
			};
		},
		{
			name: "theme-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				mode: state.mode,
			}),
			version: 1,
			migrate: (persistedState: any, version: number) => {
				console.log("🔄 Migrating theme storage from version", version);
				try {
					if (version === 0) {
						return persistedState;
					}
					return persistedState;
				} catch (error) {
					console.error(
						"❌ Migration failed, returning clean state:",
						error
					);
					return {
						mode: "system",
					};
				}
			},
		}
	)
);
