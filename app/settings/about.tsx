import { lightTheme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Acerca de</Text>
			<Text style={styles.body}>Fleetly v0.1.0 (sample)</Text>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 8, backgroundColor: lightTheme.colors.background },
	title: { color: lightTheme.colors.onSurface, fontWeight: "600", fontSize: 16 },
	body: { color: lightTheme.colors.onSurfaceVariant },
});