import { ElevatedButton } from "@/components/ElevatedButton";
import { roundness, spacing } from "@/constants/theme";
import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function SettingsLayout() {
	const { theme } = useAppTheme();
	const insets = useSafeAreaInsets();

	const styles = useMemo(() => getStyles(theme), [theme]);

	return (
		<View style={styles.container}>
			<View style={[styles.floatingButtonContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={theme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={theme.colors.onPrimary}
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
						backgroundColor: theme.colors.background,
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

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
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
