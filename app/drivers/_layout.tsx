import { roundness, spacing, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function DriversStack() {
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
			</Stack>
		</View>
	);
}

function getStyles(theme: any) {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
	});
}