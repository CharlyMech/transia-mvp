import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/stores/useThemeStore";
import { useMemo } from "react";

/**
 * Custom hook to access the current theme and theme controls
 * Provides easy access to theme colors, mode, and theme switching functions
 */
export function useAppTheme() {
	const activeTheme = useThemeStore((state) => state.activeTheme);
	const mode = useThemeStore((state) => state.mode);
	const setTheme = useThemeStore((state) => state.setTheme);
	const toggleTheme = useThemeStore((state) => state.toggleTheme);

	// Memoize the current theme object to prevent unnecessary re-renders
	const theme = useMemo(
		() => (activeTheme === "dark" ? darkTheme : lightTheme),
		[activeTheme]
	);

	return {
		theme,
		mode,
		activeTheme,
		isDark: activeTheme === "dark",
		isLight: activeTheme === "light",
		setTheme,
		toggleTheme,
	};
}
