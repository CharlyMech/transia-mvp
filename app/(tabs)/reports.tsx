import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { lightTheme, spacing, typography } from '@/constants/theme';
import type { Report } from '@/models/report';
import { listReports } from '@/services/data/mock/reports';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsScreen() {
	const [reports, setReports] = useState<Report[]>([]);

	useEffect(() => {
		listReports().then(setReports).catch(console.error);
	}, []);

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={{ width: "100%" }}
				contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
				showsVerticalScrollIndicator={false}
			>
				<View style={{
					width: "100%",
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end',
					marginBottom: spacing.sm
				}}>
					<Button
						label="Nuevo"
						icon={Plus}
						onPress={() => router.push("/reports/new-report")}
					/>
				</View>

				{reports.map((item) => (
					<Card
						key={item.id}
						onPress={() => router.push(`/reports/${item.id}`)}
						paddingX={spacing.md}
						paddingY={spacing.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={{ gap: spacing.xs }}>
							<Text style={{ fontSize: typography.bodyLarge, fontWeight: "700" }}>
								{item.title}
							</Text>
							<Text style={{ opacity: 0.7 }}>
								{new Date(item.createdAt).toLocaleDateString()}
							</Text>
							<Text style={{
								color: item.read ? "green" : "red",
								fontWeight: "600",
								fontSize: typography.bodyMedium
							}}>
								{item.read ? "Leído" : "Sin leer"}
							</Text>
						</View>
					</Card>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
});