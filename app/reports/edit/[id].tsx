import { ActionsModal } from '@/components/ActionsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { ReportForm } from '@/components/forms/ReportForm';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import type { ReportFormData } from '@/models/report';
import { useAuthStore } from '@/stores/useAuthStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { router } from 'expo-router';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditReportScreen() {
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();

	const currentReport = useReportsStore((state) => state.currentReport);
	const reportError = useReportsStore((state) => state.reportError);
	const updateReport = useReportsStore((state) => state.updateReport);
	const user = useAuthStore((state) => state.user);

	const insets = useSafeAreaInsets();

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				if (hasChanges) {
					confirmationModal.open();
					return true;
				}
				return false;
			}
		);

		return () => backHandler.remove();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanges]);

	const handleBackPress = () => {
		if (hasChanges) {
			confirmationModal.open();
		} else {
			router.back();
		}
	};

	const handleFormChange = (changed: boolean) => {
		setHasChanges(changed);
	};

	const handleSubmit = async (data: ReportFormData & { images: string[] }) => {
		if (!currentReport || !user) return;

		setLoading(true);
		try {

			updateReport(currentReport.id, {
				title: data.title,
				description: data.description || undefined,
				vehicleId: data.vehicleId,
				driverId: data.driverId,
				reporterComment: data.reporterComment || undefined,
				images: data.images,
				location: data.location || undefined,
			});

			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error updating report:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleGoBack = () => {
		successModal.close();
		router.back();
	};

	const handleConfirmDiscard = () => {
		confirmationModal.close();
		setHasChanges(false);
		router.back();
	};

	// Loading/Error states
	if (reportError) {
		return (
			<View style={[styles.container, styles.centered]}>
				<AlertCircle size={48} color={lightTheme.colors.error} />
				<Text style={styles.errorText}>Error: {reportError}</Text>
			</View>
		);
	}

	if (!currentReport) {
		return (
			<View style={[styles.container, styles.centered]}>
				<AlertCircle size={48} color={lightTheme.colors.error} />
				<Text style={styles.errorText}>Reporte no encontrado</Text>
			</View>
		);
	}

	if (!user) {
		return (
			<View style={[styles.container, styles.centered]}>
				<AlertCircle size={48} color={lightTheme.colors.error} />
				<Text style={styles.errorText}>Usuario no autenticado</Text>
			</View>
		);
	}

	const initialData: Partial<ReportFormData> & { images: string[] } = {
		title: currentReport.title,
		description: currentReport.description || '',
		vehicleId: currentReport.vehicleId,
		driverId: currentReport.driverId,
		reporterComment: currentReport.reporterComment || '',
		images: currentReport.images,
		location: currentReport.location || null,
	};

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={lightTheme.colors.background}
				translucent={false}
			/>

			<View style={[styles.floatingButtonsContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={lightTheme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={lightTheme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={handleBackPress}
				/>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollViewContent,
					{ paddingTop: insets.top + 60 }
				]}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.content}>
					<ReportForm
						driverId={currentReport.driverId}
						initialData={initialData}
						onSubmit={handleSubmit}
						onFormChange={handleFormChange}
						submitLabel="Guardar cambios"
						loading={loading}
						isEditMode={true}
					/>
				</View>
			</ScrollView>

			<ConfirmationModal
				visible={confirmationModal.visible}
				onClose={confirmationModal.close}
				onConfirm={handleConfirmDiscard}
				title="¿Descartar cambios?"
				message="Los cambios realizados se perderán si sales ahora."
				confirmText="Descartar"
				cancelText="Continuar editando"
			/>

			<ActionsModal
				visible={successModal.visible}
				onClose={handleGoBack}
				animationType="fade"
			>
				<View style={styles.successContent}>
					<View style={styles.iconContainer}>
						<CheckCircle2 size={56} color={lightTheme.colors.primary} />
					</View>

					<Text style={styles.successTitle}>¡Reporte actualizado!</Text>
					<Text style={styles.successMessage}>Los cambios se han guardado correctamente</Text>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={[styles.button, styles.primaryButton]}
							onPress={handleGoBack}
						>
							<Text style={styles.primaryButtonText}>Volver al reporte</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ActionsModal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	floatingButtonsContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		zIndex: 1000,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.xl,
		gap: spacing.md,
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
		textAlign: 'center',
	},
	permissionTitle: {
		fontSize: typography.headlineMedium,
		fontWeight: '700',
		color: lightTheme.colors.onBackground,
		textAlign: 'center',
		marginTop: spacing.md,
	},
	permissionText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
		lineHeight: 24,
	},
	noticeContainer: {
		backgroundColor: lightTheme.colors.secondaryContainer,
		padding: spacing.md,
		marginHorizontal: spacing.md,
		marginBottom: spacing.sm,
		borderRadius: roundness.sm,
		borderLeftWidth: 4,
		borderLeftColor: lightTheme.colors.secondary,
	},
	noticeText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSecondaryContainer,
		lineHeight: 20,
	},
	successContent: {
		alignItems: 'center',
		gap: spacing.md,
	},
	iconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: spacing.sm,
	},
	successTitle: {
		fontSize: typography.headlineSmall,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
		textAlign: 'center',
	},
	successMessage: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
		lineHeight: 22,
	},
	buttonsContainer: {
		width: '100%',
		marginTop: spacing.sm,
	},
	button: {
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.sm,
		borderRadius: roundness.sm,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButton: {
		backgroundColor: lightTheme.colors.primary,
	},
	primaryButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onPrimary,
	},
});