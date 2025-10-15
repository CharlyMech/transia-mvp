import { ActionsModal } from '@/components/ActionsModal';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { SkeletonList } from '@/components/skeletons';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useDriversStore } from '@/stores/useDriversStore';
import { router } from 'expo-router';
import { ExternalLink, Plus, Trash2, UserRoundX } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
	const selectedDriver = useDriversStore((state) => state.selectedDriver);

	const setSelectedDriver = useDriversStore((state) => state.setSelectedDriver);
	const clearSelectedDriver = useDriversStore((state) => state.clearSelectedDriver);
	const deleteDriver = useDriversStore((state) => state.deleteDriver);

	const actionsModal = useActionsModal();
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
						const statusStyle = getDriverStatusStyle(item.status);

						return (
							<Card
								key={item.id}
								onPress={() => router.push(`/drivers/${item.id}`)}
								onLongPress={() => handleLongPress(item)}
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
			{selectedDriver && (
				<>
					<ActionsModal
						visible={actionsModal.visible}
						onClose={handleCloseActionsModal}
						title="Acciones"
					>
						<View style={{ gap: spacing.sm }}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleViewDriver}
							>
								<ExternalLink size={22} color={lightTheme.colors.onSurface} />
								<Text style={styles.actionText}>Ver Conductor</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.warningAction]}
								onPress={handleViewDriver}
							>
								<UserRoundX size={22} color={lightTheme.colors.onWarningContainer} />
								<Text style={[styles.actionText, styles.warningText]}>Dar de baja</Text>
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
	warningAction: {
		backgroundColor: lightTheme.colors.warningContainer,
	},
	warningText: {
		color: lightTheme.colors.onWarningContainer,
	},
});