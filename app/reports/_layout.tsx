import { Stack } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function ReportsStack() {
	const { theme } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	return (
		<View style={styles.container}>
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
					name="[id]"
				/>
				<Stack.Screen
					name="new-report"
				/>
				<Stack.Screen
					name="edit"
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
});