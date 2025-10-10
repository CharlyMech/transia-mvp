import { lightTheme, spacing } from "@/constants/theme";
import { router, Stack, useSegments } from "expo-router";
import { ArrowLeft, SquarePen } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export default function FleetStack() {
	const segments = useSegments();
	const isNewVehicleRoute = segments[segments.length - 1] === 'new-vehicle';

	return (
		<View style={styles.container}>
			<Pressable
				style={styles.backButton}
				onPress={() => router.back()}
			>
				<ArrowLeft size={24} color={lightTheme.colors.onSurface} />
			</Pressable>

			{!isNewVehicleRoute && (
				<Pressable
					style={styles.editButton}
					onPress={() => console.log("Edit Vehicle")}
				>
					<SquarePen size={26} color={lightTheme.colors.onSurface} />
				</Pressable>
			)}

			<Stack
				screenOptions={{
					headerShown: false,
					animation: 'none',
					contentStyle: {
						backgroundColor: lightTheme.colors.background,
					},
				}}
			>
				<Stack.Screen name="[id]" />
				<Stack.Screen name="new-vehicle" />
			</Stack>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	backButton: {
		position: 'absolute',
		top: spacing.xxl,
		left: spacing.sm,
		zIndex: 10000,
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	editButton: {
		position: 'absolute',
		top: spacing.xxl,
		right: spacing.sm,
		zIndex: 10000,
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
});