import { ActionsModal } from '@/components/ActionsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { ReportForm } from '@/components/forms/ReportForm';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import type { Report, ReportFormData } from '@/models/report';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useNotesStore } from '@/stores/useNotesStore';
import { useReportsStore } from '@/stores/useReportsStore';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewReportScreen() {
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [newReportId, setNewReportId] = useState<string | null>(null);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();
	const addReport = useReportsStore((state) => state.addReport);
	const createNote = useNotesStore((state) => state.createNote);
	const user = useAuthStore((state) => state.user);
	const vehicles = useFleetStore((state) => state.vehicles);

	// TODO -> Implement vehicle selection or auto-assign current one
	// const currentVehicle = useMemo(() =>
	// 	// vehicles.find(v => v.id === vehicleId),
	// 	// [vehicles, vehicleId]
	// );

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

	const handleSubmit = async (data: ReportFormData & { images: string[]; noteText: string }) => {
		if (!user) {
			console.error('No user found');
			return;
		}

		setLoading(true);
		try {
			// Create the note first
			const newNote = await createNote({
				text: data.noteText,
				createdBy: user.id,
			});

			// Create the report with the noteId
			const newReport: Report = {
				id: Crypto.randomUUID(),
				title: data.title,
				description: undefined, // No longer using description
				vehicleId: data.vehicleId,
				driverId: user.id,
				createdAt: new Date(),
				readAt: null,
				closedAt: null,
				noteId: newNote.id,
				images: data.images,
				read: false,
				active: true,
				location: data.location || undefined,
			};

			addReport(newReport);
			setNewReportId(newReport.id);
			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error creating report:', error);
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo crear el reporte');
		} finally {
			setLoading(false);
		}
	};

	const handleViewReport = () => {
		if (newReportId) {
			successModal.close();
			router.replace(`/reports/${newReportId}`);
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

	// Get the first active vehicle as default
	const defaultVehicle = vehicles.find(v => v.status === 'Activo');

	if (!user) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Usuario no autenticado</Text>
			</View>
		);
	}

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
						driverId={user.id}
						initialData={{
							vehicleId: defaultVehicle?.id || '',
						}}
						onSubmit={handleSubmit}
						onFormChange={handleFormChange}
						submitLabel="Crear reporte"
						loading={loading}
					/>
				</View>
			</ScrollView>


			<ConfirmationModal
				visible={confirmationModal.visible}
				onClose={confirmationModal.close}
				onConfirm={handleConfirmDiscard}
				title="¿Descartar cambios?"
				message="Los datos ingresados se perderán si sales ahora."
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

					<Text style={styles.successTitle}>Éxito</Text>
					<Text style={styles.successMessage}>Reporte creado correctamente</Text>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={[styles.button, styles.secondaryButton]}
							onPress={handleGoBack}
						>
							<Text style={styles.secondaryButtonText}>Volver</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, styles.primaryButton]}
							onPress={handleViewReport}
						>
							<Text style={styles.primaryButtonText}>Ver reporte</Text>
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
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
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
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
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
		flexDirection: 'row',
		gap: spacing.sm,
		width: '100%',
		marginTop: spacing.sm,
	},
	button: {
		flex: 1,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.sm,
		borderRadius: roundness.sm,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButton: {
		backgroundColor: lightTheme.colors.background,
	},
	secondaryButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onBackground,
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