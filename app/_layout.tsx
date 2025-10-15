import { StoreInitializer } from "@/stores/StoreInitializer";
import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<StoreInitializer>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="+not-found" />
			</Stack>
		</StoreInitializer>
	);
}