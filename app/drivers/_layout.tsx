import { lightTheme, spacing } from "@/constants/theme";
import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export default function DriversStack() {
	return (
		<View style={styles.container}>
			<Pressable
				style={styles.backButton}
				onPress={() => router.back()}
			>
				<ArrowLeft size={30} color={lightTheme.colors.onSurface} />
			</Pressable>

			<Stack
				screenOptions={{
					headerShown: false,
					animation: 'none',
					contentStyle: {
						backgroundColor: lightTheme.colors.background,
					},
				}}
			>
				<Stack.Screen
					name="[id]"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="new-driver"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="edit"
					options={{
						headerShown: false,
					}}
				/>
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
});