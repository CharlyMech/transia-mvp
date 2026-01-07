import { useAppTheme } from "@/hooks/useAppTheme";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function FleetStack() {
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
				<Stack.Screen name="[id]" />
				<Stack.Screen name="new-vehicle" />
				<Stack.Screen name="edit" />
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