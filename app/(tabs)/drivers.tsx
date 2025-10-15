import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SkeletonList } from '@/components/skeletons';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, spacing, typography } from '@/constants/theme';
import { useDriversStore } from '@/stores/useDriversStore';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React from 'react';
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
	const drivers = useDriversStore((state) => state.drivers);
	const loading = useDriversStore((state) => state.loading);

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.headerContainer}>
				<Button
					label="Nuevo"
					icon={Plus}
					onPress={() => router.push("/drivers/new-driver")}
				/>
			</View>
			{loading ? (
				<SkeletonList count={8} cardHeight={100} />
			) : (
				<ScrollView
					style={{ width: "100%" }}
					contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
					showsVerticalScrollIndicator={false}
				>

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
								style={{ height: 100 }}
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
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	headerContainer: {
		width: "100%",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingHorizontal: spacing.sm,
		paddingTop: spacing.sm,
		paddingBottom: spacing.xs,
		backgroundColor: lightTheme.colors.background,
	},
});