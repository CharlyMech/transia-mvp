import { lightTheme, spacing } from "@/constants/theme";
import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function SettingsLayout() {
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
					name="notifications"
					options={{
						headerShown: false,
					}}
				/>
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
})


// import { lightTheme } from "@/constants/theme";
// import { Stack } from "expo-router";
// import { StyleSheet } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";


// export default function SettingsLayout() {
// 	return (
// 		<SafeAreaView style={styles.safeArea} edges={["top"]}>
// 			<Stack
// 				screenOptions={{
// 					headerShown: false,
// 				}}
// 			></Stack>
// 		</SafeAreaView>
// 	);
// }

// const styles = StyleSheet.create({
// 	safeArea: {
// 		flex: 1,
// 		backgroundColor: lightTheme.colors.background,
// 	},
// 	container: {
// 		flex: 1,
// 	},
// });