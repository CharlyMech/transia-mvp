import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, spacing, typography } from '@/constants/theme';
import type { Driver } from "@/models/driver";
import { listDrivers } from '@/services/data/mock/drivers';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function getDriverStatusStyle(status: DriverStatus) {
	switch (status) {
		case DriverStatus.ACTIVE:
			return {
				label: "Activo",
				color: lightTheme.colors.statusActive,
			};
		case DriverStatus.INACTIVE:
			return {
				label: "Inactivo",
				color: lightTheme.colors.statusInactive,
			};
		case DriverStatus.SICK_LEAVE:
			return {
				label: "Baja médica",
				color: lightTheme.colors.statusSickLeave,
			};
		case DriverStatus.HOLIDAYS:
			return {
				label: "Vacaciones",
				color: lightTheme.colors.statusHolidays,
			};
		default:
			return {
				label: "Desconocido",
				color: lightTheme.colors.onSurfaceVariant,
			};
	}
}

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

				{drivers.map((item) => {
					const statusStyle = getDriverStatusStyle(item.status);

					return (
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
								<Text
									style={{
										color: statusStyle.color,
										fontWeight: "600",
										fontSize: typography.bodyMedium,
									}}
								>
									{statusStyle.label}
								</Text>
							</View>
						</Card>
					);
				})}
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