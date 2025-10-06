import { lightTheme } from '@/constants/theme';
import type { Report } from '@/models/report';
import { listReports } from '@/services/data/mock/reports';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
	const [reports, setReports] = useState<Report[]>([]);

	useEffect(() => {
		listReports().then(setReports).catch(console.error);
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={reports}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.meta}>
							{item.read ? "✅ Leído" : "🔴 Sin leer"}
						</Text>
						<Text style={styles.meta}>
							{new Date(item.createdAt).toLocaleDateString()}
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
