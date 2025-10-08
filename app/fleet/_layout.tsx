import { lightTheme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FleetLayout() {
	return (
		<SafeAreaView style={styles.safeArea} edges={["top"]}>
			<View style={styles.container}>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				/>
			</View>
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