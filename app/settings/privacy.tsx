import { lightTheme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Política de privacidad</Text>
			<Text style={styles.body}>Texto de ejemplo…</Text>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 8, backgroundColor: lightTheme.colors.background },
	title: { color: lightTheme.colors.onSurface, fontWeight: "600", fontSize: 16 },
	body: { color: lightTheme.colors.onSurfaceVariant, lineHeight: 20 },
});