import { lightTheme } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriversStack() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<Stack
				screenOptions={{
					headerShown: false,
					// headerStyle: {
					// 	backgroundColor: lightTheme.colors.surface,
					// },
					// headerTintColor: lightTheme.colors.onSurface,
					// headerTitleAlign: "center",
				}}
			>
				<Stack.Screen
					name="index"
					options={{ title: "Conductores" }}
				/>
				<Stack.Screen
					name="[id]"
					options={{
						title: "Detalle de conductor",
						headerLeft: ({ canGoBack, tintColor }) =>
							canGoBack ? (
								<Pressable onPress={() => history.back()}>
									<MaterialCommunityIcons name="arrow-left" size={24} color={tintColor ?? "black"} />
								</Pressable>
							) : null,
					}}
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