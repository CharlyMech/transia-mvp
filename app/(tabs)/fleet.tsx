import { ActionsModal } from "@/components/ActionsModal";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { IconBadge } from "@/components/IconBadge";
import { SkeletonList } from "@/components/skeletons";
import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { useActionsModal } from "@/hooks/useActionsModal";
import { useFleetStore } from "@/stores/useFleetStore";
import { router } from "expo-router";
import { ExternalLink, Plus, Settings, Trash2, Truck } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
	const selectedVehicle = useFleetStore((state) => state.selectedVehicle);

	const setSelectedVehicle = useFleetStore((state) => state.setSelectedVehicle);
	const clearSelectedVehicle = useFleetStore((state) => state.clearSelectedVehicle);
	const deleteVehicle = useFleetStore((state) => state.deleteVehicle);

	const actionsModal = useActionsModal();
	const confirmationModal = useActionsModal();

	const handleLongPress = (vehicle: typeof vehicles[0]) => {
		setSelectedVehicle(vehicle);
		actionsModal.open();
	};

	const handleCloseActionsModal = () => {
		actionsModal.close();
		clearSelectedVehicle();
	};

	const handleViewVehicle = () => {
		if (selectedVehicle) {
			router.push(`/fleet/${selectedVehicle.id}`);
		}
	};

	const handleRequestDelete = () => {
		actionsModal.close();
		confirmationModal.open();
	};

	const handleConfirmDelete = async () => {
		if (selectedVehicle) {
			await deleteVehicle(selectedVehicle.id);
			clearSelectedVehicle();
		}
	};

	const handleCancelDelete = () => {
		confirmationModal.close();
		clearSelectedVehicle();
	};

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
								onLongPress={() => handleLongPress(item)}
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
			{selectedVehicle && (
				<>
					<ActionsModal
						visible={actionsModal.visible}
						onClose={handleCloseActionsModal}
						title="Acciones"
					>
						<View style={{ gap: spacing.sm }}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleViewVehicle}
							>
								<ExternalLink size={22} color={lightTheme.colors.onSurface} />
								<Text style={styles.actionText}>Ver vehículo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.warningAction]}
							// onPress={handleViewVehicle}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Settings}
									size={22}
									color={lightTheme.colors.onWarningContainer}
									badgeSize={12}
									badgeColor={lightTheme.colors.onWarningContainer}
									badgeBackgroundColor={lightTheme.colors.warningContainer}
								/>
								<Text style={[styles.actionText, styles.warningText]}>Poner en mantenimiento</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.dangerAction]}
							// onPress={handleViewVehicle}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Settings}
									size={22}
									color={lightTheme.colors.onErrorContainer}
									badgeSize={12}
									badgeColor={lightTheme.colors.onErrorContainer}
									badgeBackgroundColor={lightTheme.colors.errorContainer}
								/>
								<Text style={[styles.actionText, styles.dangerText]}>Dar de baja</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.dangerAction]}
								onPress={handleRequestDelete}
							>
								<Trash2 size={22} color={lightTheme.colors.error} />
								<Text style={[styles.actionText, styles.dangerText]}>
									Eliminar
								</Text>
							</TouchableOpacity>
						</View>
					</ActionsModal>

					<ConfirmationModal
						visible={confirmationModal.visible}
						onClose={handleCancelDelete}
						onConfirm={handleConfirmDelete}
						title="¿Eliminar vehículo?"
						message="Esta acción no se puede deshacer. El vehículo será eliminado permanentemente."
						confirmText="Eliminar"
						cancelText="Cancelar"
					/>
				</>
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
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.background,
		gap: spacing.md,
	},
	actionText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	dangerAction: {
		backgroundColor: lightTheme.colors.errorContainer,
	},
	dangerText: {
		color: lightTheme.colors.error,
	},
	warningAction: {
		backgroundColor: lightTheme.colors.warningContainer,
	},
	warningText: {
		color: lightTheme.colors.onWarningContainer,
	},
});