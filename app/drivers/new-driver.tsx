import { ActionsModal } from '@/components/ActionsModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { DriverForm } from '@/components/forms/DriverForm';
import { UserRole } from '@/constants/enums/UserRole';
import { roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { Driver, DriverFormData } from '@/models/driver';
import { useDriversStore } from '@/stores/useDriversStore';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewDriverScreen() {
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [newDriverId, setNewDriverId] = useState<string | null>(null);

	const { theme, isDark } = useAppTheme();
	const confirmationModal = useActionsModal();
	const successModal = useActionsModal();
	const addDriver = useDriversStore((state) => state.addDriver);

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

	const handleSubmit = async (data: DriverFormData & { imageUrl?: string | null }) => {
		setLoading(true);
		try {
			const newDriver: Driver = {
				id: Crypto.randomUUID(),
				name: data.name,
				surnames: data.surnames,
				personId: data.personId,
				completeAddress: data.completeAddress,
				birthDate: new Date(data.birthDate),
				phone: data.phone || '',
				email: data.email || '',
				licenseNumber: data.licenseNumber || '',
				registrationDate: new Date(),
				role: UserRole.DRIVER,
				status: data.status,
				imageUrl: data.imageUrl || null,
			};

			addDriver(newDriver);
			setNewDriverId(newDriver.id);
			setHasChanges(false);
			successModal.open();
		} catch (error) {
			console.error('Error creating driver:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleViewDriver = () => {
		if (newDriverId) {
			successModal.close();
			router.replace(`/drivers/${newDriverId}`);
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
					<DriverForm
						onSubmit={handleSubmit}
						onFormChange={handleFormChange}
						submitLabel="Crear conductor"
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
						<CheckCircle2 size={56} color={theme.colors.primary} />
					</View>

					<Text style={styles.successTitle}>Éxito</Text>
					<Text style={styles.successMessage}>Conductor creado correctamente</Text>

					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={[styles.button, styles.secondaryButton]}
							onPress={handleGoBack}
						>
							<Text style={styles.secondaryButtonText}>Volver</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, styles.primaryButton]}
							onPress={handleViewDriver}
						>
							<Text style={styles.primaryButtonText}>Ver conductor</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ActionsModal>
		</View>
	);
}

function getStyles(theme: any) {
	return StyleSheet.create({
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
		secondaryButton: {
			backgroundColor: theme.colors.background,
		},
		secondaryButtonText: {
			fontSize: typography.bodyLarge,
			fontWeight: '600',
			color: theme.colors.onBackground,
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
}