import { Stack } from "expo-router";

export default function DriverIdLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: 'none',
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="time-registration" />
			<Stack.Screen name="edit" />
		</Stack>
	);
}