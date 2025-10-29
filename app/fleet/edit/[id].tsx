import { ActionsModal } from "@/components/ActionsModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { VehicleForm } from "@/components/forms/VehicleForm";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { useActionsModal } from "@/hooks/useActionsModal";
import { VehicleFormData } from "@/models";
import { useFleetStore } from "@/stores/useFleetStore";
import { router } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EditVehicleScreen() {
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();

	const currentVehicle = useFleetStore((state) => state.currentVehicle);
	const vehicleError = useFleetStore((state) => state.vehicleError);
	const updateVehicle = useFleetStore((state) => state.updateVehicle);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackPress
		);

		return () => backHandler.remove();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanges]);

	const handleBackPress = (): boolean => {
		if (hasChanges) {
			confirmationModal.open();
			return true;
		}
		return false;
	};

	const handleFormChange = (changed: boolean) => {
		setHasChanges(changed);
	};

	const handleSubmit = async (data: VehicleFormData & { imageUrl?: string | null }) => {
		if (!currentVehicle) return;

		setLoading(true);
		try {
			updateVehicle(currentVehicle.id, {
				vehicleBrand: data.vehicleBrand,
				vehicleModel: data.vehicleModel,
				vehicleType: data.vehicleType,
				year: data.year,
				plateNumber: data.plateNumber,
				registrationDate: new Date(data.registrationDate),
				purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
				status: data.status,
				imageUrl: data.imageUrl || null,
			});

			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error updating vehicle:', error);
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

	if (vehicleError) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Error: {vehicleError}</Text>
			</View>
		);
	}

	if (!currentVehicle) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Vehículo no encontrado</Text>
			</View>
		);
	}

	const initialData: Partial<VehicleFormData> & { imageUrl?: string | null } = {
		vehicleBrand: currentVehicle.vehicleBrand,
		vehicleModel: currentVehicle.vehicleModel,
		vehicleType: currentVehicle.vehicleType,
		year: currentVehicle.year,
		plateNumber: currentVehicle.plateNumber,
		registrationDate: currentVehicle.registrationDate.toISOString().split('T')[0],
		purchaseDate: currentVehicle.purchaseDate?.toISOString().split('T')[0] || '',
		status: currentVehicle.status,
		imageUrl: currentVehicle.imageUrl,
	};


	return (
		<>
			{/* TODO -> Handle on changed data to execute action modal */}
			<View style={{ width: '100%', height: 30, backgroundColor: lightTheme.colors.background }} />
			<VehicleForm
				initialData={initialData}
				onSubmit={handleSubmit}
				onFormChange={handleFormChange}
				submitLabel="Guardar cambios"
				loading={loading}
			/>

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

					<Text style={styles.successTitle}>Éxito</Text>
					<Text style={styles.successMessage}>Vehículo actualizado correctamente</Text>

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
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
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