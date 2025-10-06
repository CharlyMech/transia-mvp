import { lightTheme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportsLayout() {
	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<Stack
				screenOptions={{
					headerShown: false,
					// headerStyle: {
					// 	backgroundColor: lightTheme.colors.surface,
					// },
					// headerTintColor: lightTheme.colors.onSurface,
					// headerTitleAlign: "center",
				}}
			></Stack>
		</SafeAreaView>);
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