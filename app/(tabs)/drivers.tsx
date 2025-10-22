import { ActionsModal } from '@/components/ActionsModal';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { IconBadge } from '@/components/IconBadge';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { SkeletonList } from '@/components/skeletons';
import { StatusLabel } from '@/components/StatusLabel';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useDriversStore } from '@/stores/useDriversStore';
import { router } from 'expo-router';
import { CalendarClock, Check, ExternalLink, Pause, Plus, RefreshCcw, Stethoscope, Trash2, UserRound } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function getDriverStatusIcon(status: DriverStatus) {
	switch (status) {
		case DriverStatus.ACTIVE:
			return Check;
		case DriverStatus.INACTIVE:
			return Pause;
		case DriverStatus.SICK_LEAVE:
			return Stethoscope;
		case DriverStatus.HOLIDAYS:
			return CalendarClock;
		default:
			return UserRound;
	}
}

export default function DriversScreen() {
	const drivers = useDriversStore((state) => state.drivers);
	const loading = useDriversStore((state) => state.loading);
	const selectedDriver = useDriversStore((state) => state.selectedDriver);

	const setSelectedDriver = useDriversStore((state) => state.setSelectedDriver);
	const clearSelectedDriver = useDriversStore((state) => state.clearSelectedDriver);
	const updateDriver = useDriversStore((state) => state.updateDriver);
	const deleteDriver = useDriversStore((state) => state.deleteDriver);

	const actionsModal = useActionsModal();
	const statusModal = useActionsModal();
	const confirmationModal = useActionsModal();

	const handleLongPress = (driver: typeof drivers[0]) => {
		setSelectedDriver(driver);
		actionsModal.open();
	};

	const handleCloseActionsModal = () => {
		actionsModal.close();
		clearSelectedDriver();
	};

	const handleViewDriver = () => {
		if (selectedDriver) {
			router.push(`/drivers/${selectedDriver.id}`);
			handleCloseActionsModal();
		}
	};

	const handleCloseStatusModal = () => {
		statusModal.close();
		clearSelectedDriver();
	};

	const handleChangeStatus = () => {
		actionsModal.close();
		statusModal.open();
	};

	const handleUpdateDriverStatus = (status: DriverStatus) => {
		if (selectedDriver) {
			updateDriver(selectedDriver.id, { status });
			handleCloseStatusModal();
		}
	};

	const handleRequestDelete = () => {
		actionsModal.close();
		confirmationModal.open();
	};

	const handleConfirmDelete = async () => {
		if (selectedDriver) {
			await deleteDriver(selectedDriver.id);
			clearSelectedDriver();
		}
	};

	const handleCancelDelete = () => {
		confirmationModal.close();
		clearSelectedDriver();
	};

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

						return (
							<Card
								key={item.id}
								onPress={() => router.push(`/drivers/${item.id}`)}
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
												<IconPlaceholder color={lightTheme.colors.onPrimary} icon={UserRound} size={80} />
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
												{item.name} {item.surnames}
											</Text>

											<StatusLabel
												status={item.status}
												Icon={getDriverStatusIcon(item.status)}
											/>
										</View>

										<Text style={{ fontSize: typography.bodyMedium, opacity: 0.7 }}>{item.phone}</Text>
										<View style={{
											width: "100%",
											flex: 1,
											flexDirection: "row",
											alignItems: "flex-end",
											justifyContent: "flex-end",
											gap: spacing.xs,
										}}>
											<Text style={{ fontSize: typography.bodySmall, opacity: 0.7 }}>
												Registrado en: {item.registrationDate.toLocaleDateString()}
											</Text>
										</View>
									</View>
								</View>
							</Card>
						);
					})}
				</ScrollView>
			)}
			{selectedDriver && (
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
								onPress={handleViewDriver}
							>
								<ExternalLink size={22} color={lightTheme.colors.onSurface} />
								<Text style={styles.actionText}>Ver conductor</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleChangeStatus}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={RefreshCcw}
									size={22}
									color={lightTheme.colors.onBackground}
									badgeSize={12}
									badgeColor={lightTheme.colors.onBackground}
									badgeBackgroundColor={lightTheme.colors.background}
								/>
								<Text style={styles.actionText}>Cambiar estado del conductor</Text>
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
								onPress={() => handleUpdateDriverStatus(DriverStatus.ACTIVE)}
							>
								<IconBadge
									Icon={UserRound}
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
								style={[styles.actionButton, styles.setSickAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.SICK_LEAVE)}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={Stethoscope}
									size={22}
									color={lightTheme.colors.statusSickLeave}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusSickLeave}
									badgeBackgroundColor={lightTheme.colors.statusSickLeaveContainer}
								/>
								<Text style={[styles.actionText, styles.setSickText]}>Dar de baja</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setHolidaysAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.HOLIDAYS)}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={CalendarClock}
									size={22}
									color={lightTheme.colors.statusHolidays}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusHolidays}
									badgeBackgroundColor={lightTheme.colors.statusHolidaysContainer}
								/>
								<Text style={[styles.actionText, styles.setHolidaysText]}>Asignar vacaciones</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setInactiveAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.INACTIVE)}
							>
								<IconBadge
									Icon={UserRound}
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
						title="¿Eliminar chófer?"
						message="Esta acción no se puede deshacer. El chófer será eliminado permanentemente."
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
	successAction: {
		backgroundColor: lightTheme.colors.statusActiveContainer,
	},
	successText: {
		color: lightTheme.colors.statusActive,
	},
	setHolidaysAction: {
		backgroundColor: lightTheme.colors.statusHolidaysContainer,
	},
	setHolidaysText: {
		color: lightTheme.colors.statusHolidays,
	},
	setInactiveAction: {
		backgroundColor: lightTheme.colors.background,
	},
	setInactiveText: {
		color: lightTheme.colors.onBackground,
	},
	setSickAction: {
		backgroundColor: lightTheme.colors.statusSickLeaveContainer,
	},
	setSickText: {
		color: lightTheme.colors.statusSickLeave,
	},
});