import SplashScreen from "@/app/splash";
import { lightTheme } from "@/constants/theme";
import { StoreInitializer } from "@/stores/StoreInitializer";
import { useAuthStore } from "@/stores/useAuthStore";
import { OnboardingStorage } from "@/utils/onBoardingStorage";
import { StorageCleanupTools } from "@/utils/storageCleanUpTools";
import { router, Stack, usePathname } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

export default function RootLayout() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const initialize = useAuthStore((state) => state.initialize);
	const pathname = usePathname();

	const [isCheckingStorage, setIsCheckingStorage] = useState(true);
	const [showSplash, setShowSplash] = useState(true);
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
	const [initialRouteReady, setInitialRouteReady] = useState(false);

	// Refs to prevent multiple executions
	const hasCheckedStorage = useRef(false);
	const hasInitialized = useRef(false);
	const hasNavigatedInitially = useRef(false);

	// Android auto-cleanup corrupt data and check onboarding status
	useEffect(() => {
		if (hasCheckedStorage.current) return;

		hasCheckedStorage.current = true;

		const checkAndCleanStorage = async () => {
			if (Platform.OS === 'android') {
				try {
					const wasCorrupted = await StorageCleanupTools.autoCleanupIfCorrupted();
					if (wasCorrupted) {
						console.log('✅ Datos corruptos detectados y limpiados');
					}
				} catch (error) {
					console.error('❌ Error verificando storage:', error);
				}
			}

			// Check onboarding status
			try {
				const completed = await OnboardingStorage.hasCompletedOnboarding();
				setHasCompletedOnboarding(completed);
			} catch (error) {
				console.error('❌ Error checking onboarding status:', error);
			}

			setIsCheckingStorage(false);
		};

		checkAndCleanStorage();
	}, []);

	useEffect(() => {
		if (!isCheckingStorage && !isInitialized && !hasInitialized.current) {
			hasInitialized.current = true;
			initialize();
		}
	}, [isCheckingStorage, isInitialized, initialize]);

	// Set initial route ready flag once we have all the info we need
	// Note: We set this even during splash so when splash finishes we're ready
	useEffect(() => {
		if (!isCheckingStorage && isInitialized) {
			setInitialRouteReady(true);
		}
	}, [isCheckingStorage, isInitialized]);

	// Re-check onboarding status when pathname changes (only if not showing splash)
	useEffect(() => {
		if (showSplash) return; // Don't check during splash

		const recheckOnboarding = async () => {
			if (pathname === '/login') {
				const completed = await OnboardingStorage.hasCompletedOnboarding();
				if (completed !== hasCompletedOnboarding) {
					setHasCompletedOnboarding(completed);
				}
			}
		};

		recheckOnboarding();
	}, [pathname, hasCompletedOnboarding, showSplash]);

	// Navigate to correct screen once everything is ready AND splash is finished
	// This effect should ONLY run once for initial navigation, not on every route change
	useEffect(() => {
		// IMPORTANT: Don't navigate while splash is showing
		if (showSplash) return;
		if (!initialRouteReady) return;

		// Reset navigation flag when user logs out (isAuthenticated becomes false)
		// This allows the navigation logic to run again
		if (!isAuthenticated && hasNavigatedInitially.current) {
			hasNavigatedInitially.current = false;
		}

		// IMPORTANT: Only do initial navigation once, then let the app navigate freely
		if (hasNavigatedInitially.current) return;

		hasNavigatedInitially.current = true;

		const inLoginScreen = pathname === '/login';
		const inOnboardingScreen = pathname === '/on-boarding';
		const inErrorScreen = pathname === '/error';
		const inTabsScreen = pathname.startsWith('/(tabs)');

		// If not authenticated and onboarding not completed, go to onboarding
		if (!isAuthenticated && !hasCompletedOnboarding && !inOnboardingScreen && !inErrorScreen) {
			router.replace('/on-boarding' as any);
		}
		// If not authenticated but onboarding completed, go to login
		else if (!isAuthenticated && hasCompletedOnboarding && !inLoginScreen && !inErrorScreen) {
			router.replace('/login' as any);
		}
		// If authenticated and not in tabs, go to tabs
		else if (isAuthenticated && !inTabsScreen && !inErrorScreen) {
			router.replace('/(tabs)' as any);
		}
	}, [showSplash, isAuthenticated, initialRouteReady, hasCompletedOnboarding]);

	const handleSplashFinish = useCallback(() => {
		setShowSplash(false);
	}, []);

	// Show splash screen while loading or during splash duration
	// The splash runs while we check everything in the background
	if (showSplash) {
		return <SplashScreen onFinish={handleSplashFinish} duration={2000} />;
	}

	// Only show loading if splash is done but we're still not ready
	// This should rarely happen if splash duration is long enough
	if (!initialRouteReady || isCheckingStorage || !isInitialized) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={lightTheme.colors.primary} />
			</View>
		);
	}

	return (
		<StoreInitializer>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="splash" options={{ headerShown: false }} />
				<Stack.Screen name="on-boarding" options={{ headerShown: false }} />
				<Stack.Screen name="login" options={{ headerShown: false }} />
				<Stack.Screen name="error" options={{ headerShown: false }} />
				<Stack.Screen
					name="(tabs)"
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="+not-found" />
			</Stack>
		</StoreInitializer>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: lightTheme.colors.background,
	},
});