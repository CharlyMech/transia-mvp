import { ActionsModal } from '@/components/ActionsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { ReportForm } from '@/components/forms/ReportForm';
import { roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { ReportFormData } from '@/models/report';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotesStore } from '@/stores/useNotesStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { router } from 'expo-router';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native'; //ActivityIndicator
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditReportScreen() {
	const { theme, isDark } = useAppTheme();
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [loadingNote, setLoadingNote] = useState(false);
	const [currentNote, setCurrentNote] = useState<any>(null);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();

	const currentReport = useReportsStore((state) => state.currentReport);
	const reportError = useReportsStore((state) => state.reportError);
	const updateReport = useReportsStore((state) => state.updateReport);
	const getNoteById = useNotesStore((state) => state.getNoteById);
	const createNote = useNotesStore((state) => state.createNote);
	const updateNoteText = useNotesStore((state) => state.updateNoteText);
	const user = useAuthStore((state) => state.user);

	const insets = useSafeAreaInsets();
	const styles = useMemo(() => getStyles(theme), [theme]);

	// Fetch the note if the report has one
	useEffect(() => {
		const fetchNote = async () => {
			if (currentReport?.noteId) {
				setLoadingNote(true);
				try {
					const note = await getNoteById(currentReport.noteId);
					setCurrentNote(note);
				} catch (error) {
					console.error('Error fetching note:', error);
					setCurrentNote(null);
				} finally {
					setLoadingNote(false);
				}
			} else {
				setCurrentNote(null);
			}
		};

		fetchNote();
	}, [currentReport?.noteId, getNoteById]);

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
		if (!currentReport || !user) return;

		setLoading(true);
		try {
			let noteId = currentReport.noteId;

			// If there's a note, update it or create a new one
			if (currentNote) {
				// Update existing note
				await updateNoteText(currentNote.id, data.noteText);
			} else {
				// Create new note
				const newNote = await createNote({
					text: data.noteText,
					createdBy: user.id,
				});
				noteId = newNote.id;
			}

			updateReport(currentReport.id, {
				title: data.title,
				vehicleId: data.vehicleId,
				driverId: data.driverId,
				noteId,
				images: data.images,
				location: data.location || undefined,
			});

			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error updating report:', error);
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo actualizar el reporte');
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
				<AlertCircle size={48} color={theme.colors.error} />
				<Text style={styles.errorText}>Error: {reportError}</Text>
			</View>
		);
	}

	if (!currentReport) {
		return (
			<View style={[styles.container, styles.centered]}>
				<AlertCircle size={48} color={theme.colors.error} />
				<Text style={styles.errorText}>Reporte no encontrado</Text>
			</View>
		);
	}

	if (!user) {
		return (
			<View style={[styles.container, styles.centered]}>
				<AlertCircle size={48} color={theme.colors.error} />
				<Text style={styles.errorText}>Usuario no autenticado</Text>
			</View>
		);
	}

	// Show loading while fetching note
	if (loadingNote && currentReport.noteId) {
		return (
			<View style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Cargando nota...</Text>
			</View>
		);
	}

	const initialData: Partial<ReportFormData> & { images: string[]; noteText?: string } = {
		title: currentReport.title,
		vehicleId: currentReport.vehicleId,
		driverId: currentReport.driverId,
		images: currentReport.images,
		location: currentReport.location || null,
		noteText: currentNote?.text || '',
	};

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle={isDark ? "light-content" : "dark-content"}
				backgroundColor={theme.colors.background}
				translucent={false}
			/>

			<View style={[styles.floatingButtonsContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={theme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={theme.colors.onPrimary}
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
						<CheckCircle2 size={56} color={theme.colors.primary} />
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

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
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
		color: theme.colors.error,
		textAlign: 'center',
	},
	loadingText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
		marginTop: spacing.md,
	},
	permissionTitle: {
		fontSize: typography.headlineMedium,
		fontWeight: '700',
		color: theme.colors.onBackground,
		textAlign: 'center',
		marginTop: spacing.md,
	},
	permissionText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
		lineHeight: 24,
	},
	noticeContainer: {
		backgroundColor: theme.colors.secondaryContainer,
		padding: spacing.md,
		marginHorizontal: spacing.md,
		marginBottom: spacing.sm,
		borderRadius: roundness.sm,
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.secondary,
	},
	noticeText: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSecondaryContainer,
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
		color: theme.colors.onSurface,
		textAlign: 'center',
	},
	successMessage: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurfaceVariant,
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
		backgroundColor: theme.colors.primary,
	},
	primaryButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onPrimary,
	},
});