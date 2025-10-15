import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SkeletonList } from "@/components/skeletons";
import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { lightTheme, spacing, typography } from "@/constants/theme";
import { useFleetStore } from "@/stores/useFleetStore";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getVehicleStatusStyle(status: VehicleStatus) {
	switch (status) {
		case VehicleStatus.ACTIVE:
			return {
				label: "Activo",
				color: lightTheme.colors.statusActive,
			};
		case VehicleStatus.INACTIVE:
			return {
				label: "Inactivo",
				color: lightTheme.colors.statusInactive,
			};
		case VehicleStatus.BROKEN_DOWN:
			return {
				label: "Averiado",
				color: lightTheme.colors.statusBrokenDown,
			};
		case VehicleStatus.MAINTENANCE:
			return {
				label: "Mantenimiento",
				color: lightTheme.colors.statusMaintenance,
			};
		default:
			return {
				label: "Desconocido",
				color: lightTheme.colors.onSurfaceVariant,
			};
	}
}

export default function FleetScreen() {
	const vehicles = useFleetStore((state) => state.vehicles);
	const loading = useFleetStore((state) => state.loading);

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.headerContainer}>
				<Button
					label="Nuevo"
					icon={Plus}
					onPress={() => router.push("/fleet/new-vehicle")}
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
					{vehicles.map((item) => {
						const statusStyle = getVehicleStatusStyle(item.status);
						return (
							<Card
								key={item.id}
								onPress={() => router.push(`/fleet/${item.id}`)}
								paddingX={spacing.md}
								paddingY={spacing.sm}
								shadow='none'
								backgroundColor={lightTheme.colors.surface}
								style={{ height: 100 }}
							>
								<View style={{ gap: spacing.xs }}>
									<Text style={{ fontSize: typography.bodyLarge, fontWeight: "700" }}>
										{item.vehicleBrand} {item.vehicleModel} ({item.year})
									</Text>
									<Text style={{ opacity: 0.7 }}>
										{item.vehicleType} • {item.plateNumber}
									</Text>
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