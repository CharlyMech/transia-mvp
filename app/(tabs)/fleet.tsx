import AnimatedTabTransition from "@/components/AnimatedTabTransition";
import { lightTheme } from "@/constants/theme";
import type { Vehicle } from "@/models/vehicle"; // asegúrate que coincide con el schema real
import { listFleet } from "@/services/data/mock/fleet";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function FleetScreen() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);

	useEffect(() => {
		listFleet().then(setVehicles).catch(console.error);
	}, []);

	return (
		<AnimatedTabTransition>
			<View style={styles.container}>
				<FlatList
					data={vehicles}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<Text style={styles.title}>
								{item.vehicleBrand} {item.vehicleModel} ({item.year})
							</Text>
							<Text style={styles.meta}>Tipo: {item.vehicleType}</Text>
							<Text style={styles.meta}>Matrícula: {item.plateNumber}</Text>
							<Text style={[styles.meta, { color: item.active ? "green" : "red" }]}>
								{item.active ? "Activo" : "Inactivo"}
							</Text>
						</View>
					)}
				/>
			</View>
		</AnimatedTabTransition>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		padding: 16,
	},
	card: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: lightTheme.colors.onSurface,
	},
	meta: {
		fontSize: 12,
		color: lightTheme.colors.onSurfaceVariant,
		marginTop: 4,
	},
});