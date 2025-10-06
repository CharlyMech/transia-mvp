import { lightTheme } from '@/constants/theme';
import type { Driver } from "@/models/driver";
import { listDrivers } from '@/services/data/mock/drivers';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function DriversScreen() {
	const [drivers, setDrivers] = useState<Driver[]>([]);

	useEffect(() => {
		listDrivers()
			.then(setDrivers)
			.catch((err) => console.error("Error cargando drivers:", err));
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={drivers}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.phone}>{item.phone ?? "Sin teléfono"}</Text>
						<Text style={styles.status}>
							{item.active ? "Activo" : "Inactivo"}
						</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: lightTheme.colors.onBackground,
	},
	card: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	name: {
		color: lightTheme.colors.onSurface,
		fontSize: 16,
		fontWeight: "600",
	},
	phone: {
		color: lightTheme.colors.onSurfaceVariant,
		marginTop: 4,
	},
	status: {
		marginTop: 4,
		color: lightTheme.colors.primary,
		fontWeight: "500",
	},
});
