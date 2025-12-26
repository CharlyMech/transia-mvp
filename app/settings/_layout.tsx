import { ElevatedButton } from "@/components/ElevatedButton";
import { lightTheme, roundness, spacing } from "@/constants/theme";
import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function SettingsLayout() {
	const insets = useSafeAreaInsets();
	return (
		<View style={styles.container}>
			<View style={[styles.floatingButtonContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={lightTheme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={lightTheme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={() => router.back()}
				/>
			</View>

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
					name="privacy"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="terms"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="about"
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
	floatingButtonContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		zIndex: 1000,
	},
});