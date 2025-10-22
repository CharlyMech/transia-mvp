import { StoreInitializer } from "@/stores/StoreInitializer";
import { useAuthStore } from "@/stores/useAuthStore";
import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const initialize = useAuthStore((state) => state.initialize);
	const pathname = usePathname();

	useEffect(() => {
		if (!isInitialized) {
			initialize();
		}
	}, [isInitialized, initialize]);

	useEffect(() => {
		if (!isInitialized) return;

		const inLoginScreen = pathname === '/login';
		const inErrorScreen = pathname === '/error';

		if (!isAuthenticated && !inLoginScreen && !inErrorScreen) {
			router.replace('/login' as any);
		} else if (isAuthenticated && inLoginScreen) {
			router.replace('/(tabs)' as any);
		}
	}, [isAuthenticated, isInitialized, pathname]);

	return (
		<StoreInitializer>
			<Stack screenOptions={{ headerShown: false }}>
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