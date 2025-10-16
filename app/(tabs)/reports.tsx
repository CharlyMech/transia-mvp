import { router } from 'expo-router';
import { Check, CheckCheck, ExternalLink, EyeOff, Plus, Trash2, TriangleAlert } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionsModal } from '@/components/ActionsModal';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { SkeletonList } from '@/components/skeletons';

import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useReportsStore } from '@/stores/useReportsStore';


export default function ReportsScreen() {
	const reports = useReportsStore((state) => state.reports);
	const loading = useReportsStore((state) => state.loading);
	const selectedReport = useReportsStore((state) => state.selectedReport);

	const setSelectedReport = useReportsStore((state) => state.setSelectedReport);
	const clearSelectedReport = useReportsStore((state) => state.clearSelectedReport);
	const deleteReport = useReportsStore((state) => state.deleteReport);
	const updateReport = useReportsStore((state) => state.updateReport);

	const actionsModal = useActionsModal();
	const confirmationModal = useActionsModal();

	const handleLongPress = (report: typeof reports[0]) => {
		setSelectedReport(report);
		actionsModal.open();
	};

	const handleCloseActionsModal = () => {
		actionsModal.close();
		clearSelectedReport();
	};

	const handleViewReport = () => {
		if (selectedReport) {
			router.push(`/reports/${selectedReport.id}`);
			handleCloseActionsModal();
		}
	};

	const handleToggleRead = () => {
		if (selectedReport) {
			updateReport(selectedReport.id, { read: !selectedReport.read });
			handleCloseActionsModal();
		}
	};

	const handleToggleActive = () => {
		if (selectedReport) {
			updateReport(selectedReport.id, { active: !selectedReport.active });
			handleCloseActionsModal();
		}
	};

	const handleRequestDelete = () => {
		actionsModal.close();
		confirmationModal.open();
	};

	const handleConfirmDelete = async () => {
		if (selectedReport) {
			await deleteReport(selectedReport.id);
			clearSelectedReport();
		}
	};

	const handleCancelDelete = () => {
		confirmationModal.close();
		clearSelectedReport();
	};

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.headerContainer}>
				<Button
					label="Nuevo"
					icon={Plus}
					onPress={() => router.push("/reports/new-report")}
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
					{reports.map((item) => (
						<Card
							key={item.id}
							onPress={() => router.push(`/reports/${item.id}`)}
							onLongPress={() => handleLongPress(item)}
							paddingX={spacing.sm}
							paddingY={spacing.sm}
							shadow='none'
							backgroundColor={lightTheme.colors.surface}
							style={{ height: 100 }}
						>
							<View style={{
								flex: 1,
								flexDirection: "column",
								justifyContent: "space-between"
							}}>
								<View style={{
									flexDirection: "column",
									gap: spacing.sm
								}}>
									<View style={{
										width: "100%",
										flexDirection: "row",
										alignItems: "baseline",
										justifyContent: "space-between"
									}}>
										<Text style={{
											fontSize: typography.titleMedium,
											fontWeight: "600"
										}}>
											{item.title}
										</Text>
										<View style={{
											flexDirection: "row",
											alignItems: "center",
											gap: spacing.xs
										}}>
											{item.active ? (
												<>
													<Text style={{
														fontSize: typography.bodyMedium,
														fontWeight: "400",
														color: lightTheme.colors.warning
													}}>
														Pendiente
													</Text>
													<TriangleAlert
														size={20}
														color={lightTheme.colors.warning}
													/>
												</>
											) : (
												<>
													<Text style={{
														fontSize: typography.bodyMedium,
														fontWeight: "400",
														color: lightTheme.colors.statusActive
													}}>
														Resuelta
													</Text>
													<CheckCheck
														size={20}
														color={lightTheme.colors.statusActive}
													/>
												</>
											)}
										</View>
									</View>

									<Text
										style={{
											fontSize: typography.bodyMedium,
											fontWeight: "400",
											opacity: 0.7
										}}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										Vehículo: {item.vehicleId}
									</Text>
								</View>

								<View style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "flex-end"
								}}>
									{item.active ?
										(
											<Text
												style={{
													fontSize: typography.bodySmall,
													fontWeight: "400",
													opacity: 0.7
												}}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												Fecha de creación: {item.createdAt.toLocaleDateString()}
											</Text>
										)
										:
										(
											<Text
												style={{
													fontSize: typography.bodySmall,
													fontWeight: "400",
													opacity: 0.7
												}}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												Cerrada en: {item.closedAt?.toLocaleDateString()}
											</Text>
										)}
								</View>
							</View>
						</Card>
					))}
				</ScrollView>
			)
			}

			{
				selectedReport && (
					<>
						<ActionsModal
							visible={actionsModal.visible}
							onClose={handleCloseActionsModal}
							title="Acciones"
						>
							<View style={{ gap: spacing.sm }}>
								<TouchableOpacity
									style={styles.actionButton}
									onPress={handleViewReport}
								>
									<ExternalLink size={22} color={lightTheme.colors.onSurface} />
									<Text style={styles.actionText}>Ver incidencia</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.actionButton}
									onPress={handleToggleRead}
								>
									{selectedReport.read ? (
										<>
											<EyeOff size={22} color={lightTheme.colors.onSurface} />
											<Text style={styles.actionText}>Marcar como no leído</Text>
										</>
									) : (
										<>
											<Check size={22} color={lightTheme.colors.tertiary} />
											<Text style={styles.actionText}>Marcar como leído</Text>
										</>
									)}
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.actionButton}
									onPress={handleToggleActive}
								>
									{selectedReport.active ? (
										<>
											<CheckCheck size={22} color={lightTheme.colors.onSurface} />
											<Text style={styles.actionText}>Marcar como resuelta</Text>
										</>
									) : (
										<>
											<TriangleAlert size={22} color={lightTheme.colors.tertiary} />
											<Text style={styles.actionText}>Marcar como pendiente</Text>
										</>
									)}
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
							title="¿Eliminar reporte?"
							message="Esta acción no se puede deshacer. El reporte será eliminado permanentemente."
							confirmText="Eliminar"
							cancelText="Cancelar"
						/>
					</>
				)
			}
		</SafeAreaView >
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
});