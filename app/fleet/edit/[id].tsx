import { ActionsModal } from "@/components/ActionsModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ElevatedButton } from "@/components/ElevatedButton";
import { VehicleForm } from "@/components/forms/VehicleForm";
import { roundness, spacing, typography } from "@/constants/theme";
import { useActionsModal } from "@/hooks/useActionsModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { VehicleFormData } from "@/models";
import { useFleetStore } from "@/stores/useFleetStore";
import { router } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditVehicleScreen() {
	const { theme, isDark } = useAppTheme();
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();

	const currentVehicle = useFleetStore((state) => state.currentVehicle);
	const vehicleError = useFleetStore((state) => state.vehicleError);
	const updateVehicle = useFleetStore((state) => state.updateVehicle);

	const insets = useSafeAreaInsets();
	const styles = useMemo(() => getStyles(theme), [theme]);

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
					<VehicleForm
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
						<CheckCircle2 size={56} color={theme.colors.primary} />
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
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.error,
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
		backgroundColor: theme.colors.primary,
	},
	primaryButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onPrimary,
	},
});