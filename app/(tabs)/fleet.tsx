import { ActionsModal } from "@/components/ActionsModal";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { IconBadge } from "@/components/IconBadge";
import { IconPlaceholder } from "@/components/IconPlaceholder";
import { SkeletonList } from "@/components/skeletons";
import { StatusLabel } from "@/components/StatusLabel";
import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { useActionsModal } from "@/hooks/useActionsModal";
import { useFleetStore } from "@/stores/useFleetStore";
import { router } from "expo-router";
import { AlertTriangle, Check, ExternalLink, Pause, Plus, RefreshCcw, Trash2, Truck, Wrench, X } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getVehicleStatusIcon(status: VehicleStatus) {
	switch (status) {
		case VehicleStatus.ACTIVE:
			return Check;
		case VehicleStatus.INACTIVE:
			return Pause;
		case VehicleStatus.BROKEN_DOWN:
			return AlertTriangle;
		case VehicleStatus.MAINTENANCE:
			return Wrench;
		default:
			return Truck;
	}
}

export default function FleetScreen() {
	const vehicles = useFleetStore((state) => state.vehicles);
	const loading = useFleetStore((state) => state.loading);
	const selectedVehicle = useFleetStore((state) => state.selectedVehicle);

	const setSelectedVehicle = useFleetStore((state) => state.setSelectedVehicle);
	const clearSelectedVehicle = useFleetStore((state) => state.clearSelectedVehicle);
	const updateVehicle = useFleetStore((state) => state.updateVehicle);
	const deleteVehicle = useFleetStore((state) => state.deleteVehicle);

	const actionsModal = useActionsModal();
	const statusModal = useActionsModal();
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

	const handleCloseStatusModal = () => {
		statusModal.close();
		clearSelectedVehicle();
	};

	const handleChangeStatus = () => {
		actionsModal.close();
		statusModal.open();
	};

	const handleUpdateVehicleStatus = (status: VehicleStatus) => {
		if (selectedVehicle) {
			updateVehicle(selectedVehicle.id, { status });
			handleCloseStatusModal();
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
						return (
							<Card
								key={item.id}
								onPress={() => router.push(`/fleet/${item.id}`)}
								onLongPress={() => handleLongPress(item)}
								paddingX={spacing.sm}
								paddingY={spacing.sm}
								shadow='none'
								backgroundColor={lightTheme.colors.surface}
								style={{ height: 100 }}
							>
								<View style={{ width: "100%", height: "100%", flex: 1, flexDirection: "row", gap: spacing.md }}>
									<View style={{ alignItems: "center", justifyContent: "center" }}>
										{item.imageUrl ?
											<Image source={{ uri: item.imageUrl }} style={{ width: 80, height: 80, borderRadius: roundness.xs }} />
											:
											<Card
												paddingX={0}
												paddingY={0}
												rounded={roundness.xs}
												shadow='none'
												backgroundColor={`${lightTheme.colors.primary}CC`}
											>
												<IconPlaceholder color={lightTheme.colors.onPrimary} icon={Truck} size={80} />
											</Card>
										}
									</View>
									<View style={{
										flex: 1,
										flexDirection: "column",
										alignItems: "flex-start",
										justifyContent: "flex-start",
										gap: spacing.sm,
									}}>
										<View style={{
											width: "100%",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
											gap: spacing.sm,
										}}>
											<Text
												style={{
													fontSize: typography.titleMedium,
													fontWeight: "600",
													flex: 1,
												}}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												{item.vehicleBrand} {item.vehicleModel} ({item.year})
											</Text>
											<StatusLabel
												status={item.status}
												Icon={getVehicleStatusIcon(item.status)}
											/>
										</View>

										<Text style={{ fontSize: typography.bodyMedium, opacity: 0.7 }}>
											{item.plateNumber} ({item.vehicleType})
										</Text>
										<View style={{
											width: "100%",
											flex: 1,
											flexDirection: "row",
											alignItems: "flex-end",
											justifyContent: "flex-end",
											gap: spacing.xs,
										}}>
											{item.purchaseDate ? (
												<Text style={{ fontSize: typography.bodySmall, opacity: 0.7 }}>
													Activo desde: {item.purchaseDate.toLocaleDateString()}
												</Text>
											) : (
												<Text style={{ fontSize: typography.bodySmall, opacity: 0.7 }}>
													Registrado en: {item.registrationDate.toLocaleDateString()}
												</Text>
											)}
										</View>
									</View>
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
						animationType="none"
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
								style={styles.actionButton}
								onPress={handleChangeStatus}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={RefreshCcw}
									size={22}
									color={lightTheme.colors.onBackground}
									badgeSize={12}
									badgeColor={lightTheme.colors.onBackground}
									badgeBackgroundColor={lightTheme.colors.background}
								/>
								<Text style={styles.actionText}>Cambiar estado del vehículo</Text>
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

					<ActionsModal
						visible={statusModal.visible}
						onClose={handleCloseStatusModal}
						animationType="none"
					>
						<View style={{ gap: spacing.sm, marginTop: spacing.md }}>
							<TouchableOpacity
								style={[styles.actionButton, styles.successAction,]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.ACTIVE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Check}
									size={22}
									color={lightTheme.colors.statusActive}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusActive}
									badgeBackgroundColor={lightTheme.colors.statusActiveContainer}
								/>
								<Text style={styles.actionText}>Dar de alta</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setBrokenDownAction]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.INACTIVE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={X}
									size={22}
									color={lightTheme.colors.statusBrokenDown}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusBrokenDown}
									badgeBackgroundColor={lightTheme.colors.statusBrokenDownContainer}
								/>
								<Text style={[styles.actionText, styles.setBrokenDownText]}>Dar de baja</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setMaintenanceAction]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.MAINTENANCE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Wrench}
									size={22}
									color={lightTheme.colors.statusMaintenance}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusMaintenance}
									badgeBackgroundColor={lightTheme.colors.statusMaintenanceContainer}
								/>
								<Text style={[styles.actionText, styles.setMaintenanceText]}>Poner en mantenimiento</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setInactiveAction]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.INACTIVE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Pause}
									size={22}
									color={lightTheme.colors.onBackground}
									badgeSize={12}
									badgeColor={lightTheme.colors.onBackground}
									badgeBackgroundColor={lightTheme.colors.background}
								/>
								<Text style={[styles.actionText, styles.setInactiveText]}>Poner como inactivo</Text>
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
	successAction: {
		backgroundColor: lightTheme.colors.statusActiveContainer,
	},
	successText: {
		color: lightTheme.colors.statusActive,
	},
	setMaintenanceAction: {
		backgroundColor: lightTheme.colors.statusMaintenanceContainer,
	},
	setMaintenanceText: {
		color: lightTheme.colors.statusMaintenance,
	},
	setInactiveAction: {
		backgroundColor: lightTheme.colors.background,
	},
	setInactiveText: {
		color: lightTheme.colors.onBackground,
	},
	setBrokenDownAction: {
		backgroundColor: lightTheme.colors.statusBrokenDownContainer,
	},
	setBrokenDownText: {
		color: lightTheme.colors.statusBrokenDown,
	},
});