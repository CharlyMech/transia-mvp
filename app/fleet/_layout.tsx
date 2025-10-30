import { lightTheme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function FleetStack() {
	return (
		<View style={styles.container}>
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
				<Stack.Screen name="edit" />
			</Stack>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
});