import { Stack } from "expo-router";

export default function VehicleIdLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "none",
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="assignation-history" />
			<Stack.Screen name="maintenance-history" />
			<Stack.Screen name="report-history" />
		</Stack>
	);
}
