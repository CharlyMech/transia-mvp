import { ActionsModal } from '@/components/ActionsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { DriverForm } from '@/components/forms/DriverForm';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import type { DriverFormData } from '@/models/driver';
import { useDriversStore } from '@/stores/useDriversStore';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditDriverScreen() {
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();

	const currentDriver = useDriversStore((state) => state.currentDriver);
	const driverError = useDriversStore((state) => state.driverError);
	const updateDriver = useDriversStore((state) => state.updateDriver);

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

	const handleSubmit = async (data: DriverFormData & { imageUrl?: string | null }) => {
		if (!currentDriver) return;

		setLoading(true);
		try {
			updateDriver(currentDriver.id, {
				name: data.name,
				surnames: data.surnames,
				personId: data.personId,
				completeAddress: data.completeAddress,
				birthDate: new Date(data.birthDate),
				phone: data.phone || '',
				email: data.email || '',
				licenseNumber: data.licenseNumber || '',
				status: data.status,
				imageUrl: data.imageUrl || null,
			});

			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error updating driver:', error);
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

	if (driverError) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Error: {driverError}</Text>
			</View>
		);
	}

	if (!currentDriver) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Conductor no encontrado</Text>
			</View>
		);
	}

	const initialData: Partial<DriverFormData> & { imageUrl?: string | null } = {
		name: currentDriver.name,
		surnames: currentDriver.surnames,
		personId: currentDriver.personId,
		completeAddress: currentDriver.completeAddress,
		birthDate: currentDriver.birthDate.toISOString().split('T')[0],
		phone: currentDriver.phone,
		email: currentDriver.email,
		licenseNumber: currentDriver.licenseNumber,
		status: currentDriver.status,
		imageUrl: currentDriver.imageUrl,
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
					<DriverForm
						initialData={initialData}
						onSubmit={handleSubmit}
						onFormChange={handleFormChange}
						submitLabel="Guardar cambios"
						loading={loading}
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
				cancelText="Seguir editando"
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
					<Text style={styles.successMessage}>Conductor actualizado correctamente</Text>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={[styles.button, styles.primaryButton]}
							onPress={handleGoBack}
						>
							<Text style={styles.primaryButtonText}>Volver</Text>
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
	primaryButton: {
		backgroundColor: lightTheme.colors.primary,
	},
	primaryButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onPrimary,
	},
});