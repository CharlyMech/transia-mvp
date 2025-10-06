import { lightTheme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriversStack() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen
					name="index"
					options={{ title: "Conductores" }}
				/>
				<Stack.Screen
					name="[id]/index"
				/>
			</Stack>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	container: {
		flex: 1,
	},
});