import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { lightTheme, spacing, typography } from '@/constants/theme';
import type { Driver } from "@/models/driver";
import { listDrivers } from '@/services/data/mock/drivers';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriversScreen() {
	const [drivers, setDrivers] = useState<Driver[]>([]);

	useEffect(() => {
		listDrivers()
			.then(setDrivers)
			.catch((err) => console.error("Error cargando drivers:", err));
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
						onPress={() => router.push("/drivers/new-driver")}
					/>
				</View>

				{drivers.map((item) => (
					<Card
						key={item.id}
						onPress={() => router.push(`/drivers/${item.id}`)}
						paddingX={spacing.md}
						paddingY={spacing.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={{ gap: spacing.xs }}>
							<Text style={{ fontSize: typography.bodyLarge, fontWeight: "700" }}>
								{item.name} {item.surnames ? `(${item.surnames.split(" ")[0]})` : ""}
							</Text>
							<Text style={{ opacity: 0.7 }}>{item.phone}</Text>
							<Text style={{ color: item.active ? "green" : "red", fontWeight: "600", fontSize: typography.bodyMedium }}>
								{item.active ? "Activo" : "Inactivo"}
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