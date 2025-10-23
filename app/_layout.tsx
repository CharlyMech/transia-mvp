import { lightTheme } from "@/constants/theme";
import { StoreInitializer } from "@/stores/StoreInitializer";
import { useAuthStore } from "@/stores/useAuthStore";
import { StorageCleanupTools } from "@/utils/storageCleanUpTools";
import { router, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

export default function RootLayout() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const initialize = useAuthStore((state) => state.initialize);
	const pathname = usePathname();

	const [isCheckingStorage, setIsCheckingStorage] = useState(true);

	// Android auto-cleanup corrupt data
	useEffect(() => {
		const checkAndCleanStorage = async () => {
			if (Platform.OS === 'android') {
				try {
					console.log('🔍 Verificando integridad del storage...');
					const wasCorrupted = await StorageCleanupTools.autoCleanupIfCorrupted();

					if (wasCorrupted) {
						console.log('✅ Datos corruptos detectados y limpiados');
					} else {
						console.log('✅ Storage OK');
					}
				} catch (error) {
					console.error('❌ Error verificando storage:', error);
				}
			}
			setIsCheckingStorage(false);
		};

		checkAndCleanStorage();
	}, []);

	useEffect(() => {
		if (!isCheckingStorage && !isInitialized) {
			initialize();
		}
	}, [isCheckingStorage, isInitialized, initialize]);

	useEffect(() => {
		if (!isInitialized || isCheckingStorage) return;

		const inLoginScreen = pathname === '/login';
		const inErrorScreen = pathname === '/error';

		if (!isAuthenticated && !inLoginScreen && !inErrorScreen) {
			router.replace('/login' as any);
		} else if (isAuthenticated && inLoginScreen) {
			router.replace('/(tabs)' as any);
		}
	}, [isAuthenticated, isInitialized, pathname, isCheckingStorage]);

	if (isCheckingStorage) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={lightTheme.colors.primary} />
			</View>
		);
	}

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

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: lightTheme.colors.background,
	},
});