import { ActionsModal } from '@/components/ActionsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { VehicleForm } from '@/components/forms/VehicleForm';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import type { Vehicle, VehicleFormData } from '@/models';
import { useFleetStore } from '@/stores/useFleetStore';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewVehicleScreen() {
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [newVehicleId, setNewVehicleId] = useState<string | null>(null);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();
	const addVehicle = useFleetStore((state) => state.addVehicle);

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

	const handleSubmit = async (data: VehicleFormData & { imageUrl?: string | null }) => {
		setLoading(true);
		try {
			const newVehicle: Vehicle = {
				id: Crypto.randomUUID(),
				vehicleBrand: data.vehicleBrand,
				vehicleModel: data.vehicleModel,
				vehicleType: data.vehicleType,
				year: data.year,
				plateNumber: data.plateNumber,
				registrationDate: new Date(data.registrationDate),
				purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
				status: data.status,
				imageUrl: data.imageUrl || null,
			};

			addVehicle(newVehicle);
			setNewVehicleId(newVehicle.id);
			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error creating vehicle:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleViewVehicle = () => {
		if (newVehicleId) {
			successModal.close();
			router.replace(`/fleet/${newVehicleId}`);
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
					<VehicleForm
						onSubmit={handleSubmit}
						onFormChange={handleFormChange}
						submitLabel="Crear vehículo"
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
					<Text style={styles.successMessage}>Vehículo creado correctamente</Text>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={[styles.button, styles.secondaryButton]}
							onPress={handleGoBack}
						>
							<Text style={styles.secondaryButtonText}>Volver</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, styles.primaryButton]}
							onPress={handleViewVehicle}
						>
							<Text style={styles.primaryButtonText}>Ver vehículo</Text>
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