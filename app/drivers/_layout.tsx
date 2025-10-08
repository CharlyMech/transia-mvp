import { lightTheme } from "@/constants/theme";
import { router, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export default function DriversStack() {
	return (
		<View style={styles.container}>
			{/* Botón flotante común para todas las subrutas */}
			<Pressable
				style={styles.backButton}
				onPress={() => router.back()}
			>
				<ArrowLeft size={24} color={lightTheme.colors.onSurface} />
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
					name="[id]/index"
					// options={{ title: "Detalles del Conductor" }}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="new-driver/index"
					// options={{ title: "Nuevo Conductor" }}
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
		top: 50,
		left: 16,
		zIndex: 10000,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});