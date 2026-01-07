import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/stores/useThemeStore";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Appearance } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { PaperProvider } from "react-native-paper";

interface ThemeProviderProps {
	children: React.ReactNode;
}

/**
 * ThemeProvider component that manages theme switching with smooth transitions
 * Listens to system theme changes and updates the app theme accordingly
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
	const activeTheme = useThemeStore((state) => state.activeTheme);
	const mode = useThemeStore((state) => state.mode);
	const updateActiveTheme = useThemeStore((state) => state.updateActiveTheme);
	const initialize = useThemeStore((state) => state.initialize);
	const isInitialized = useThemeStore((state) => state.isInitialized);

	// Animated value for smooth theme transitions
	const themeProgress = useSharedValue(activeTheme === "dark" ? 1 : 0);

	// Initialize theme store on mount
	useEffect(() => {
		if (!isInitialized) {
			initialize();
		}
	}, [isInitialized, initialize]);

	// Listen to system theme changes
	useEffect(() => {
		// Only listen to system changes if mode is set to "system"
		if (mode !== "system") return;

		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			updateActiveTheme(colorScheme);
		});

		return () => {
			subscription.remove();
		};
	}, [mode, updateActiveTheme]);

	// Animate theme transitions
	useEffect(() => {
		themeProgress.value = withTiming(activeTheme === "dark" ? 1 : 0, {
			duration: 300,
		});
	}, [activeTheme]);

	// Select the current theme based on activeTheme
	const currentTheme = activeTheme === "dark" ? darkTheme : lightTheme;

	// Animated background style for smooth color transitions
	const animatedBackgroundStyle = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			themeProgress.value,
			[0, 1],
			[lightTheme.colors.background, darkTheme.colors.background]
		);

		return {
			backgroundColor,
		};
	});

	return (
		<PaperProvider theme={currentTheme}>
			<StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
			<Animated.View style={[{ flex: 1 }, animatedBackgroundStyle]}>
				{children}
			</Animated.View>
		</PaperProvider>
	);
}
